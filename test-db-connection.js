const express = require('express');
const mysql = require('mysql2'); // Hoặc mysql nếu bạn dùng cách 1
const app = express();

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'myapp'
});

// Route chính
app.get('/', (req, res) => {
    // Thử kết nối database
    db.connect((err) => {
        if (err) {
            console.error('Kết nối thất bại:', err);
            res.status(500).send('Kết nối database thất bại! Chi tiết lỗi: ' + err.message);
            return;
        }

        // Nếu thành công
        res.send('Đã kết nối thành công tới database MySQL!');
        
        // Đóng kết nối sau khi kiểm tra (tùy chọn)
        db.end((err) => {
            if (err) {
                console.error('Lỗi khi đóng kết nối:', err);
            }
        });
    });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});