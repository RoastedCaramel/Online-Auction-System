const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: category });
        res.render('auctions/index', { products });
    } else {
        const products = await Product.find({});
        res.render('auctions/index', { products });
    }
}
module.exports.renderNewForm = (req, res) => {
    res.render('auctions/new');
}

module.exports.createAuction = async (req, res, next) => {
    const product = new Product(req.body.product);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    product.seller = req.user._id;
    await product.save();
    console.log(product);
    req.flash('success', 'Successfully added product for auction');
    res.redirect(`/active-auctions/${product._id}`);
}

module.exports.showAuction = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller');
    if (!product) {
        req.flash('error', 'Auction item not found');
        res.redirect('/active-auctions')
    }
    else
        res.render('auctions/show', { product });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Auction item not found');
        res.redirect('/active-auctions')
    }
    else
        res.render('auctions/edit', { product });
}

module.exports.updateAuction = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });

    /*
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        product.images.push(...imgs);
        await product.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }*/



    req.flash('success', 'Successfully updated product');
    res.redirect(`/active-auctions/${product._id}`);
}

module.exports.deleteAuction = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted product');
    res.redirect('/active-auctions');
}

module.exports.bidAuction = async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findById(id);
    if (req.body.newPrice <= prod.price) {
        req.flash('error', 'Bidding price must be higher than the current price');
        res.redirect(`/active-auctions/${prod._id}`);
    } else {
        const product = await Product.findByIdAndUpdate(id, { price: req.body.newPrice });
        req.flash('success', 'Successfully placed bid');
        res.redirect(`/active-auctions/${product._id}`);
    }
}

module.exports.renderSearch = (req, res) => {
    res.render('auctions/search');
}
module.exports.displaySearchResults = async (req, res) => {
    const searchTerm = req.body.searchBar;
    if (!searchTerm) {
        req.flash('error', 'Please enter something!');
        res.redirect('/active-auctions/search');
    } else {
        await Product.createIndexes({ title: "text", description: "text" });
        const products = await Product.find({ $text: { $search: searchTerm } });
        res.render('auctions/index', { products });
    }
}