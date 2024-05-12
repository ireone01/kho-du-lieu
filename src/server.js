const express = require('express');
const cors = require('cors'); // Thêm dòng này
const sql = require('mssql');
const app = express();
const port = 3001;

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000' // chỉ cho phép yêu cầu CORS từ origin này
}));

// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',
    password: '12345',
    server: 'IRE-ONCE\\IREONE01', // You can use 'localhost\\instance' if you're connecting to named instance
    database: 'x1',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// Route để lấy dữ liệu
app.get('/', async (req, res) => {
    try {
        await sql.connect(config)
        const result = await sql.query('SELECT * FROM huy2');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
