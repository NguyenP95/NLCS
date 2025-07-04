const express = require('express');
const router = express.Router();
const payContractController = require('../controllers/payController');
const auth = require('../middleware/auth');

router.post('/:id', auth, payContractController.payContract);
router.get('/paidContract', auth, payContractController.getPaidContract);
router.get('/notPaidContract', auth, payContractController.getNotPaidContract);
router.delete('/deletePayment/:id', auth, payContractController.deletePayment);
router.post('/stripe/create-checkout-session', auth, payContractController.createCheckout);
router.post('/stripe/confirm-stripe', payContractController.confirmStripe);

module.exports = router;