const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-sepay-token",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
});
const json = (data, status=200, origin="*") => new Response(JSON.stringify(data), {status, headers:cors(origin)});
const clean = (v, max=300) => String(v ?? "").trim().slice(0,max);
const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
async function sheetsToken(env) {
  const sa = { client_email: env.GOOGLE_CLIENT_EMAIL, private_key: env.GOOGLE_PRIVATE_KEY };
  const now = Math.floor(Date.now()/1000);
  const head = b64url(new TextEncoder().encode(JSON.stringify({alg:"RS256",typ:"JWT"})));
  const claim = b64url(new TextEncoder().encode(JSON.stringify({iss:sa.client_email,scope:"https://www.googleapis.com/auth/spreadsheets",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600})));
  const unsigned = head+"."+claim;
  // Cloudflare secrets may contain PEM line breaks either literally or as escaped "\\n".
  // Normalize both forms before decoding the PKCS#8 key.
  const privateKey = String(sa.private_key || "").trim().replace(/\\n/g, "\n");
  const pem = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  if (!pem || !/^[A-Za-z0-9+/]+={0,2}$/.test(pem) || pem.length % 4 !== 0) {
    throw new Error("GOOGLE_PRIVATE_KEY is not valid PEM/base64. Set the full Google service-account private_key, including BEGIN/END PRIVATE KEY lines.");
  }
  const der = Uint8Array.from(atob(pem),c=>c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8",der,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned));
  const assertion = unsigned+"."+b64url(sig);
  const response = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion})});
  if(!response.ok) { const detail = await response.text(); throw new Error("Google OAuth failed ("+response.status+"): "+detail.slice(0,300)); }
  return (await response.json()).access_token;
}
async function sheetRequest(env, range, method="GET", values) {
  const token=await sheetsToken(env), id=env.GOOGLE_SHEET_ID;
  const base="https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(id)+"/values/"+encodeURIComponent(range);
  const url=method==="POST"?base+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS":base;
  const res=await fetch(url,{method,headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},...(method==="POST"?{body:JSON.stringify({values})}:{})});
  if(!res.ok) throw new Error("Google Sheets API error: "+res.status);
  return res.json();
}
async function rows(env){const data=await sheetRequest(env,"Transactions!A:J");return data.values||[];}
async function findOrder(env,code){const all=await rows(env);return all.findIndex((r,i)=>i>0&&r[0]===code);}
async function cleanupPending(env) {
  const all = await rows(env);
  if (all.length <= 1) return { deleted: 0 };
  const ttlHours = Math.max(1, Number(env.PENDING_TTL_HOURS) || 24);
  const cutoff = Date.now() - ttlHours * 60 * 60 * 1000;
  const expired = [];
  for (let i = 1; i < all.length; i++) {
    const row = all[i];
    if (String(row[6] || "").toUpperCase() !== "PENDING") continue;
    const createdAt = Date.parse(row[9] || "");
    if (Number.isFinite(createdAt) && createdAt <= cutoff) expired.push(i);
  }
  if (!expired.length) return { deleted: 0 };
  const token = await sheetsToken(env);
  const meta = await fetch("https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(env.GOOGLE_SHEET_ID) + "?fields=sheets.properties");
  if (!meta.ok) throw new Error("Unable to read Google Sheets metadata");
  const spreadsheet = await meta.json();
  const sheet = (spreadsheet.sheets || []).find(s => s.properties?.title === "Transactions");
  if (!sheet) throw new Error('Sheet "Transactions" not found');
  // Delete bottom-up so earlier row indices remain valid.
  const requests = expired.sort((a,b) => b-a).map(index => ({
    deleteDimension: {
      range: { sheetId: sheet.properties.sheetId, dimension: "ROWS", startIndex: index, endIndex: index + 1 }
    }
  }));
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(env.GOOGLE_SHEET_ID) + ":batchUpdate", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ requests })
  });
  if (!response.ok) throw new Error("Unable to delete expired pending transactions: " + response.status);
  return { deleted: expired.length };
}

async function handle(request,env){
 const origin=request.headers.get("Origin")||"*";
 if(request.method==="OPTIONS") return new Response(null,{headers:cors(origin)});
 const url=new URL(request.url), path=url.pathname;
 try {
  if(path==="/health") return json({ok:true,service:"tip4me-worker"},200,origin);
  if(path==="/webhooks/sepay"&&request.method==="POST"){
   const supplied=request.headers.get("x-sepay-token")||request.headers.get("Authorization")?.replace(/^(?:Bearer|Apikey)\s+/i,"");
   if(!env.SEPAY_WEBHOOK_TOKEN||supplied!==env.SEPAY_WEBHOOK_TOKEN) return json({success:false,error:"Unauthorized"},401,origin);
   const p=await request.json();
   if(String(p.transferType||"").toLowerCase()!=="in"||String(p.accountNumber||"")!==env.ACCOUNT_NUMBER) return json({success:true,ignored:true},200,origin);
   const content=String(p.content||p.description||"").toUpperCase();
   const all=await rows(env);
   const target=all.find((r,i)=>i>0&&r[0]&&content.includes(String(r[0]).toUpperCase())&&r[6]!=="SUCCESS"&&Number(r[3])===Number(p.transferAmount));
   if(!target) return json({success:true,matched:false},200,origin);
   const rowIndex=all.indexOf(target)+1;
   const token=await sheetsToken(env);
   const range="Transactions!G"+rowIndex;
   const patch=await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(env.GOOGLE_SHEET_ID)+"/values/"+encodeURIComponent(range)+"?valueInputOption=RAW",{method:"PUT",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({values:[["SUCCESS"]]})});
   if(!patch.ok) throw new Error("Unable to update transaction status");
   const auditToken=await sheetsToken(env);
   const auditRange="Transactions!H"+rowIndex+":I"+rowIndex;
   await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(env.GOOGLE_SHEET_ID)+"/values/"+encodeURIComponent(auditRange)+"?valueInputOption=RAW",{method:"PUT",headers:{Authorization:"Bearer "+auditToken,"Content-Type":"application/json"},body:JSON.stringify({values:[[String(p.transactionID||""),String(p.transactionDate||new Date().toISOString())]]})});
   return json({success:true,matched:true,orderCode:target[0]},200,origin);
  }
  if(request.method==="POST"&&(path==="/api/transactions"||path==="/")){
   const p=await request.json();
   if(p.action!=="create_transaction") return json({success:false,error:"Unknown action"},400,origin);
   const amount=Number(p.amount), id=clean(p.id,40);
   if(!id||!Number.isSafeInteger(amount)||amount<1000) return json({success:false,error:"Invalid transaction"},400,origin);
   const existing=await findOrder(env,id);
   if(existing>=0) return json({success:true,transaction:{id}},200,origin);
   await sheetRequest(env,"Transactions!A:J","POST",[[id,clean(p.donorName,100)||"Đại gia giấu tên",clean(p.message,500),amount,"VND","vietqr","PENDING","","",new Date().toISOString()]]);
   return json({success:true,transaction:{id}},200,origin);
  }
  if(request.method==="GET"){
   const action=url.searchParams.get("action");
   if(path==="/api/transactions/status"||action==="check_status"){
    const code=url.searchParams.get("order_code")||url.searchParams.get("id");
    const index=await findOrder(env,code);
    if(index<0) return json({status:"PENDING"},200,origin);
    const all=await rows(env);
    return json({status:all[index][6]==="SUCCESS"?"SUCCESS":"PENDING"},200,origin);
   }
   if(path==="/api/supporters"||action==="get_supporters"){
    const all=await rows(env);
    const supporters=all.slice(1).filter(r=>r[6]==="SUCCESS").reverse().map(r=>({id:r[0],name:r[1],donorName:r[1],message:r[2],amount:Number(r[3]),status:r[6]}));
    return json({success:true,supporters},200,origin);
   }
   if(path==="/api/stats") {
    const all=await rows(env), paid=all.slice(1).filter(r=>r[6]==="SUCCESS");
    return json({success:true,count:paid.length,total:paid.reduce((s,r)=>s+Number(r[3]||0),0)},200,origin);
   }
  }
  return json({success:false,error:"Not found"},404,origin);
 } catch(e){ console.error("Tip4Me Worker error:", e?.message || e); return json({success:false,error:"Internal server error",detail:String(e?.message || "Unknown error").slice(0,240)},500,origin); }
}
export default {
 fetch: handle,
 async scheduled(controller, env, ctx) {
  ctx.waitUntil(cleanupPending(env).then(result => {
   console.log("Pending transaction cleanup:", result.deleted, "deleted");
  }).catch(error => console.error("Pending cleanup failed:", error?.message || error)));
 }
};
