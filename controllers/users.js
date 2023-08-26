const User = require('../models/user.js')

module.exports.renderRegister = ((req, res) => {
    res.render('users/register')
})

module.exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Successfully added a New User !')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    console.log(req.session)
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back !!')
    const redirectUrl = res.locals.returnTo  || '/campgrounds'
       res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
    req.flash('success', 'Good Bye !!')
    res.redirect('/campgrounds')
}
