import crypto from 'crypto';
import https from 'https';
import Booking from "../models/Booking";




const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const ipnUrl = 'http://localhost:5000/api/payment/databack';
const redirectUrl = 'http://localhost:5000/api/payment/create';


export const ipnapi = async (req, res) => {
    try {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            resultCode,
            message,
            extraData = '', // Mặc định chuỗi rỗng nếu thiếu
            signature,
        } = req.query;

        console.log('[IPN API] Received query params:', req.query);

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

        console.log('[IPN API] Raw signature string:', rawSignature);

        const generatedSignature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        console.log('[IPN API] Expected signature:', generatedSignature);
        console.log('[IPN API] Received signature:', signature);

        if (generatedSignature !== signature) {
            console.error('[IPN API] Invalid signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        console.log('[IPN API] Signature validated successfully');

        if (resultCode === '0') {
            console.log('[IPN API] Payment successful for orderId:', orderId);

            const updatedBooking = await Booking.findOneAndUpdate(
                { _id: orderId },
                { status: 'Paid' },
                { new: true }
            );

            if (!updatedBooking) {
                console.error('[IPN API] Booking not found for orderId:', orderId);
                return res.status(404).json({ message: 'Booking not found' });
            }

            console.log('[IPN API] Booking updated:', updatedBooking);

            return res.status(200).json({
                message: 'Payment successful',
                booking: updatedBooking,
            });
        } else {
            console.error('[IPN API] Payment failed with resultCode:', resultCode);
            return res.status(400).json({ message: 'Payment failed', resultCode });
        }
    } catch (error) {
        console.error('[IPN API] Error handling payment callback:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const createPayment = (req, res) => {
    try {
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const partnerCode = 'MOMO'; // Khai báo partnerCode ở đây
        const orderInfo = req.body.orderInfo;
        const amount = req.body.amount;
        const orderId = req.body.orderId;
        const requestId = orderId;
        const extraData = '';
        const redirectUrl = req.body.redirectUrl || 'http://localhost:3000/payment-success'; // Có thể nhận từ body hoặc dùng giá trị mặc định
        const ipnUrl = req.body.ipnUrl || 'http://localhost:5000/api/payment/databack'; // Có thể nhận từ body hoặc dùng giá trị mặc định

        console.log('[Create Payment] Request body:', req.body);

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

        console.log('[Create Payment] Raw signature string:', rawSignature);

        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        console.log('[Create Payment] Generated signature:', signature);

        const requestBody = JSON.stringify({
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: 'vi',
            requestType: 'payWithMethod',
            autoCapture: true,
            extraData,
            signature,
        });

        console.log('[Create Payment] Request body sent to MoMo:', requestBody);

        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };

        const reqMomo = https.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                console.log('[Create Payment] MoMo response:', data);
                const result = JSON.parse(data);

                if (result.resultCode === 0) {
                    console.log('[Create Payment] Payment URL:', result.payUrl);
                    res.json({ paymentUrl: result.payUrl });
                } else {
                    console.error('[Create Payment] Payment failed:', result);
                    res.status(400).json({ error: 'Payment failed', result });
                }
            });
        });

        reqMomo.on('error', (e) => {
            console.error('[Create Payment] Error with request:', e.message);
            res.status(500).json({ error: 'Internal server error' });
        });

        reqMomo.write(requestBody);
        reqMomo.end();
    } catch (error) {
        console.error('[Create Payment] Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


  

export const handlePaymentCallback = async (req, res) => {
    try {
        console.log('[Payment Callback] Query params:', req.query);

        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            resultCode,
            message,
            extraData = '',
            signature,
        } = req.query;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

        console.log('[Payment Callback] Raw signature string:', rawSignature);

        const generatedSignature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        console.log('[Payment Callback] Expected signature:', generatedSignature);
        console.log('[Payment Callback] Received signature:', signature);

        if (generatedSignature !== signature) {
            console.error('[Payment Callback] Invalid signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        if (resultCode === '0') {
            console.log('[Payment Callback] Payment successful for orderId:', orderId);

            const updatedBooking = await Booking.findOneAndUpdate(
                { _id: orderId },
                { status: 'Paid' },
                { new: true }
            );

            if (!updatedBooking) {
                console.error('[Payment Callback] Booking not found for orderId:', orderId);
                return res.status(404).json({ message: 'Booking not found' });
            }

            console.log('[Payment Callback] Booking updated:', updatedBooking);

            return res.status(200).json({
                message: 'Payment successful',
                booking: updatedBooking,
            });
        } else {
            console.error('[Payment Callback] Payment failed with resultCode:', resultCode);
            return res.status(400).json({ message: 'Payment failed', resultCode });
        }
    } catch (error) {
        console.error('[Payment Callback] Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
