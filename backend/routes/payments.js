const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /api/payments/mpesa-stk-push — M-Pesa STK Push stub
router.post('/mpesa-stk-push', protect, async (req, res) => {
    try {
        const { phone, amount, orderId } = req.body;
        // STUB: In production, integrate with Safaricom Daraja API
        // This simulates sending an STK push and returning a checkout request ID
        const checkoutRequestId = 'ws_CO_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        console.log(`[M-Pesa STUB] STK Push sent to ${phone} for KES ${amount} (Order: ${orderId})`);

        res.json({
            success: true,
            message: 'STK push sent to your phone. Enter your M-Pesa PIN to complete payment.',
            checkoutRequestId,
            // In production: MerchantRequestID, CheckoutRequestID, ResponseCode, etc.
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/payments/mpesa-callback — M-Pesa callback stub
router.post('/mpesa-callback', async (req, res) => {
    // STUB: Safaricom sends payment confirmation here
    console.log('[M-Pesa STUB] Callback received:', JSON.stringify(req.body));
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
});

// POST /api/payments/verify — verify payment status
router.post('/verify', protect, async (req, res) => {
    try {
        const { checkoutRequestId } = req.body;
        // STUB: In production, query Safaricom for transaction status
        res.json({
            success: true,
            status: 'completed',
            mpesaCode: 'SIM' + Date.now().toString(36).toUpperCase(),
            message: 'Payment verified successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
