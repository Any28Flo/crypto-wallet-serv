const jwt = require('jsonwebtoken');
const User = require('../models/user-model');


const verifyToken = token =>{
    new Promise((resolve, reject) =>{
        jwt.verify(token , process.env.SESSION_SECRET  , (err, payload) =>{
            if(err) return reject(err)
            resolve(payload)
        })
    })
};
 const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).end()
    }

    const token = bearer.split('Bearer ')[1].trim()
    let payload;
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res.status(401).end()
    }

    const user = await User.findById(payload.id)
        .select('-password')
        .lean()
        .exec()

    if (!user) {
        return res.status(401).end()
    }

    req.user = user;
    next();
};
module.exports = protect;