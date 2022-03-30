const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Product = require('../models/product');
const catchAsync = require('../utils/catchAsync');
const { productSchema } = require('../schemas');
const user = require('../models/user');
const bids = require('../models/bids');
const { schema } = require('../models/product');
const { isLoggedIn, isSeller, validateProduct } = require('../middleware');
const auctions = require('../controller/auctions');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(auctions.index))
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(auctions.createAuction));


router.route('/search')
    .get(auctions.renderSearch)
    .post(catchAsync(auctions.displaySearchResults));

router.get('/new', isLoggedIn, auctions.renderNewForm);

router.route('/:id')
    .get(catchAsync(auctions.showAuction))
    .patch(isLoggedIn, catchAsync(auctions.bidAuction))
    .put(isLoggedIn, isSeller, upload.array('image'), validateProduct, catchAsync(auctions.updateAuction))
    .delete(isLoggedIn, isSeller, catchAsync(auctions.deleteAuction));

router.get('/:id/edit', isLoggedIn, isSeller, catchAsync(auctions.renderEditForm));


module.exports = router;