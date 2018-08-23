// Last modification: 23-08-2018 11:54:16

const express = require('express');
const router = express.Router();
const customerController = require('./customerController')

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.post('/delete', customerController.deleteCustomers);

// router.put('/', customerController.createCustomer);
router.get('/:cid', customerController.getCustomer);
router.post('/:cid', customerController.updateCustomer);

router.get('/:cid/delete', customerController.deleteCustomer);
router.post('/:cid/setstate', customerController.setCustomerState);

module.exports = router;
