const requiresLogin = (req, res, next) => {
    const account = req.session.account

    if (!account) {
        return res.redirect('/');
    }

    return next();
};

const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        const account = req.session.account
        const totalStats = account.athletics + account.wisdom + account.charisma;
        const maxStats = 10;

        if (totalStats < maxStats){
            console.log("Got here");
            return res.redirect('/creator');
        }
        return res.redirect('/maker');
    }
    
    return next();
};

const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    
    return next();
};

const bypassSecure = (req, res, next) => {
    next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}