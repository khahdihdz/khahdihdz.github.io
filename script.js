document.getElementById('donationForm').addEventListener('submit', async function(event) {
            event.preventDefault(); // Ngăn trang reload

            const donorName = document.getElementById('donorName').value;
            const characterName = document.getElementById('characterName').value;
            const donationAmount = document.getElementById('donationAmount').value;
            const billImage = document.getElementById('billImage').files[0];

            // Kiểm tra nếu số tiền dưới 10,000 VND
            if (donationAmount < 10000) {
                alert("Số tiền ủng hộ tối thiểu là 10,000 VND.");
                return;
            }

            // Tải ảnh lên Imgur qua API
            const formData = new FormData();
            formData.append("image", billImage);

            const imgurResponse = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 0ec456789155e23' // Sử dụng Client ID mới
                },
                body: formData
            });

            const imgurData = await imgurResponse.json();
            const imgurUrl = imgurData.data.link; // Link ảnh sau khi tải lên

            // Tạo thông điệp gửi qua Discord Webhook
            const webhookURL = 'https://discord.com/api/webhooks/1296179509854343241/JwO5NgNUIBYiid6xDqlopM6ccL3J1LYbqf-L27aBA8uWo1v1kO2GlGc10czmesZyiuYw'; // Thay bằng webhook của bạn
            const message = {
                content: `Cảm ơn **${donorName}**!\nChúng tôi chân thành cảm ơn bạn đã ủng hộ **${donationAmount} VND** cho máy chủ Dream City. Sự đóng góp của bạn sẽ giúp chúng tôi duy trì và phát triển cộng đồng ngày càng tốt đẹp hơn.`,
                embeds: [
                    {
                        title: `Ủng hộ từ **${donorName}**`,
                        description: `• Số tiền ủng hộ: **${donationAmount} VND**\n• Tên nhân vật: **${characterName}**\nChúng tôi sẽ kiểm tra và cộng tiền vào tài khoản của bạn trong game ngay khi có thể. Sự hỗ trợ của bạn là động lực lớn để chúng tôi không ngừng cải thiện và mang đến những trải nghiệm tuyệt vời hơn cho tất cả các thành viên.\n

Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!\n

Một lần nữa, cảm ơn bạn rất nhiều vì đã đồng hành cùng Dream City!\n

Chúc bạn có những giây phút thư giãn tuyệt vời trong thế giới của chúng ta!`,
                        color: 7506394, // Màu sắc của embed
                        image: {
                            url: imgurUrl // Ảnh bill đã tải lên
                        }
                    }
                ]
            };

            await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            // Hiển thị thông điệp cảm ơn
            document.getElementById('thankYouMessage').textContent = "Cảm ơn bạn đã ủng hộ!";
            document.getElementById('thankYouMessage').style.display = 'block';

            // Đặt lại form
            this.reset();
        });

        // CFX Server ID (thay ID của bạn vào đây)
        const CFX_SERVER_ID = "v9jel5"; // Thay "abc123" bằng ID server của bạn

        // Hàm lấy thông tin máy chủ từ API CFXRE
        async function fetchPlayerCount() {
            try {
                const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${CFX_SERVER_ID}`);
                const data = await response.json();
                
                const playerCount = data.Data.players.length; // Số lượng người chơi trực tuyến
                document.getElementById('playerCount').textContent = `Số người chơi trực tuyến: ${playerCount} thành viên`;
            } catch (error) {
                document.getElementById('playerCount').textContent = 'Không thể tải số lượng người chơi.';
                console.error('Lỗi khi lấy thông tin máy chủ:', error);
            }
        }

        // Gọi hàm để lấy thông tin khi tải trang
        fetchPlayerCount();