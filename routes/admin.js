const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.get('/home',adminCon.get_home_page);
router.post('/home',adminCon.post_home_page);

router.get('/logout',adminCon.get_logout_page);

router.get('/login',adminCon.get_login_page);
router.post('/login',adminCon.post_login_page);

router.get('/signup',adminCon.get_signup_page);
router.post('/signup',adminCon.post_signup_page);

router.get('/search',adminCon.get_search_page);
router.post('/search',adminCon.post_search_page);

router.get('/profile',adminCon.get_profile_page);
router.post('/profile',adminCon.post_profile_page);

router.get('/movies',adminCon.get_movies_page);
router.post('/movies',adminCon.post_movies_page);

router.get('/ratings',adminCon.get_ratings_page);
router.post('/ratings',adminCon.post_ratings_page);

router.get('/preferences',adminCon.get_preferences_page);
router.post('/preferences',adminCon.post_preferences_page);

router.get('/admin',adminCon.get_admin_page);
router.post('/admin',adminCon.post_admin_page);

/*router.get('/prods',adminCon.get_prods_test);
router.post('/prods',adminCon.post_prods_test);

router.get('/cart',adminCon.get_cart_test);
router.post('/cart',adminCon.post_cart_test);

router.get('/orders',adminCon.get_orders_test);
router.post('/orders',adminCon.post_orders_test);
*/


module.exports = router;
