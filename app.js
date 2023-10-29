// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env" });
}

// console.log(process.env.secret)
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport')
const LocalStaretgy = require('passport-local')
const mongoose = require('mongoose')
const Joi = require('joi')

const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);

const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
// const Campground = require('./models/campground')
const Review = require('./models/review')


//auth requireing 


const User = require('./models/user')

// const campground = require('./models/campground')
// const catchAsync = require('./utils/catchAsync')
// const exp = require('constants')

// Exports ROUTES 
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')

// in case of deploying
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
// const dbUrl = process.env.DB_URL;

// process.env.DB_URL

mongoose.connect('mongodb+srv://am4195:01090374398@cluster0.5s3cdob.mongodb.net/')
    .then(() => {
        console.log(" Mongo CONNECTEDD")
    })
    .catch((err) => {
        console.log("OHH Mongo Error Connection")
        console.log(err)

    })


// in case of local storage:
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//     .then(() => {
//         console.log(" Mongo CONNECTEDD")
//     })
//     .catch((err) => {
//         console.log("OHH Mongo Error Connection")
//         console.log(err)

//     })
const app = express()

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.set('view engine', 'ejs')
// app.get('/', (req, res) => {
//     res.render('home')
// })


//to use PUT or PATCH with form
methodOverride = require('method-override')
app.use(methodOverride('_method'))

// const validateCampground = (req, res, next) => {

//     const { error } = campgroundSchema.validate(req.body);
//     // let  msg;
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }
//     else {
//         next()
//     }
//     // console.log(msg);
// }

// const validateReview = (req, res, next) => {
//     const { error } = validateReview.validate(req.body);
//     // let  msg;
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }
//     else {
//         next()
//     }
// }


app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnsw1mkyu/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
secret = process.env.secret || 'thisshouldbeabettersecret!'

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60

})
store.on("error", function (e) {
    console.log('Storing Error', e)
})

const sessionConfig = {
    name: 'session',
    secret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

//Auth should be after session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStaretgy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     console.log(req.session)

//     res.locals.currentUser = req.user
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.use('/', usersRoutes)
// app.use('/campgrounds', campgroundRoutes)
// app.use('/campgrounds/:id/reviews', reviewRoutes)




// app.get('/fakeuser', async (req, res) => {
//     const user = User({
//         email: 'bedo@gm.com',
//         username: "sayem"
//     })
//     const newUser = await User.register(user, 'colt')
//     res.send(newUser)
// })

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)



app.get('/', (req, res) => {
    res.render('home')
});

app.all("*", (req, res, next) => {
    next(new ExpressError('Page NOT fouNd'), 404);
})

app.use((err, req, res, next) => {
    const { statusCode = 500, } = err;
    if (!err.message) err.message = ' OOH Something goes Wrong'
    res.status(statusCode).render("error", { err })
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})




// app.get('/makecampground',async(req,res)=>{
//     const camp = new Campground({title:"My BackYard"})
//     await camp.save()
//     res.send(camp)
// })