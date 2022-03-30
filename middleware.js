const Product = require('./models/product');
const { productSchema } = require('./schemas');

const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

/*validating product*/
module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
/*end of validating product*/

/*checking if it is the seller*/
module.exports.isSeller = async (req, res, next) => {
    const { id } = req.params;
    const prod = await Product.findById(id);
    if (!prod.seller.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/active-auctions/${id}`);
    }
    next();
}