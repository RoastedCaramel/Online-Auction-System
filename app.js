if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const activeAuctonsRoutes = require('./routes/active-auctions');
const mongoSanitize = require('express-mongo-sanitize');

const { productSchema } = require('./schemas');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/miniProject-sem3');
    console.log("Data Base Connected");
}

const db = mongoose.connection;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.use('/Public', express.static('public'));
app.use(mongoSanitize());

const sessionConfig = {
    resave: false,
    secret: 'hidden',
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,

    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/', (req, res) => {
    res.render('home');
})

app.use('/', userRoutes);
app.use('/active-auctions', activeAuctonsRoutes);



app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

/*Error Handling*/
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})

