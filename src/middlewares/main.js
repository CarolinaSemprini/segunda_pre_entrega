/*export const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.render('errorLogin', { msg: 'Authentication Error' });
    }
    next()
}

export const isAdmin = (req, res, next) => {
    if (req.session.user.role != 'admin') {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
    next()
}
//lo de premium se debe ajustar al resto 
const isPremiumOrAdmin = (req, res, next) => {
    if (req.user.role !== 'premium' && req.user.role !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }
    next();
};

export const isUser = (req, res, next) => {
    if (req.session.user.role != 'user') {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
    next()
}*/

//carpeta middlewares archivo main.js
export const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.render('errorLogin', { msg: 'Authentication Error' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
    next();
};

export const isPremiumOrAdmin = (req, res, next) => {
    if (req.session.user.role !== 'premium' && req.session.user.role !== 'admin') {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
    next();
};

export const isPremium = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'premium') {
        next(); // Permitir acceso si el usuario tiene rol premium
    } else {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
};

export const isUser = (req, res, next) => {
    if (req.session.user.role !== 'user') {
        return res.render('errorLogin', { msg: 'Authorization Error' });
    }
    next();
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({
                status: 'error',
                msg: 'You do not have permission to access this resource'
            });
        }
        next();
    };
};



