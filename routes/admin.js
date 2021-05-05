const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/add-product',adminCon.get_test);
router.post('/add-product',adminCon.post_test);

/*router.get('/prods',adminCon.get_prods_test);
router.post('/prods',adminCon.post_prods_test);

router.get('/cart',adminCon.get_cart_test);
router.post('/cart',adminCon.post_cart_test);

router.get('/orders',adminCon.get_orders_test);
router.post('/orders',adminCon.post_orders_test);
*/


module.exports = router;
