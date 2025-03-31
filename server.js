const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin',
    database: 'myapp'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối thành công tới MySQL!');
});

// Route cho các trang
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Xử lý đăng ký
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const checkSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).send('Lỗi server');
        }
        if (results.length > 0) {
            return res.send('Username đã tồn tại! <a href="/register">Thử lại</a>');
        }
        const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertSql, [username, password], (err) => {
            if (err) {
                console.error('Lỗi khi thêm user:', err);
                return res.status(500).send('Lỗi server');
            }
            res.send('Đăng ký thành công! <a href="/login">Đăng nhập ngay</a>');
        });
    });
});

// Xử lý đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).send('Lỗi server');
        }
        if (results.length > 0) {
            // Đăng nhập thành công, chuyển hướng sang /index
            res.redirect('/index');
        } else {
            res.send('Sai username hoặc password! <a href="/login">Thử lại</a>');
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});