const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/home',adminCon.get_home_page);
// router.post('/home',adminCon.post_test);

router.get('/login',adminCon.get_login_page);
router.post('/login',adminCon.post_login_page);

/*router.get('/prods',adminCon.get_prods_test);
router.post('/prods',adminCon.post_prods_test);

router.get('/cart',adminCon.get_cart_test);
router.post('/cart',adminCon.post_cart_test);

router.get('/orders',adminCon.get_orders_test);
router.post('/orders',adminCon.post_orders_test);
*/


module.exports = router;
