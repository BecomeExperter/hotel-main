import express from 'express';
import { createPayment, ipnapi,handlePaymentCallback } from '../controllers/ThanhToan.js';

const router = express.Router();

// Route tạo yêu cầu thanh toán
router.post('/create', createPayment);

// Route xử lý IPN (Instant Payment Notification) từ MoMo
router.post('/callback',ipnapi);
router.get('/databack', handlePaymentCallback);
router.get('/payment-success', (req, res) => {
    // Bạn có thể render một trang HTML thông báo thanh toán thành công
    res.send(`
        <html>
            <head><title>Thanh toán thành công</title></head>
            <body>
                <h1>Thanh toán thành công!</h1>
                <p>Cảm ơn bạn đã thanh toán. Hóa đơn của bạn đã được xử lý thành công.</p>
            </body>
        </html>
    `);
});

export default router;
