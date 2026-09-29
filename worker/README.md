# Tip4Me API (Cloudflare Workers + Google Sheets)

## Sheet schema
Create a Google spreadsheet and a tab named **Transactions**. Put these headers in row 1:
`OrderCode | DonorName | Message | Amount | Currency | PaymentMethod | Status | SePayTransactionID | PaidAt | CreatedAt`

Share the spreadsheet with the service account email as **Editor**.

## Cloudflare secrets
Set the following Worker secrets:
- `GOOGLE_SERVICE_ACCOUNT`: full JSON key contents of a Google service account.
- `SHEET_ID`: spreadsheet ID from its URL.
- `SEPAY_TOKEN`: secret token configured in SePay webhook.
- `ACCOUNT_NUMBER`: receiving bank account number (default frontend currently uses 8880812999).

Deploy with Wrangler from this folder after `npm install`, or configure GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit)
- `CLOUDFLARE_ACCOUNT_ID`

Set the SePay webhook URL to `https://<worker-name>.<account-subdomain>.workers.dev/webhooks/sepay`, method POST, header `x-sepay-token: <SEPAY_TOKEN>`.

## API
- `GET /health`
- `POST /api/transactions`
- `GET /api/transactions/status?order_code=BMC12345`
- `GET /api/supporters`
- `GET /api/stats`

Legacy frontend query actions `check_status` and `get_supporters` remain supported. Do not publish service-account JSON or webhook secrets in Git.
