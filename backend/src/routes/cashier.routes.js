const express = require('express');
const router = express.Router();
const c = require('../controllers/cashier.controller');
const { authenticate, authorize, requireProfile } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/bills', authorize('Thu_ngan', 'Admin'), c.getBills);
router.get('/bills/:id', authorize('Thu_ngan', 'Admin'), c.getBillDetail);
router.post('/bills/:id/pay', authorize('Thu_ngan', 'Admin'), requireProfile, c.payBill);

module.exports = router;