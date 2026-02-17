exports.authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader,"Auth");
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    if (authHeader === 'token') { // Replace with actual token validation logic
        next(); // Token is valid, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Invalid token' });
    }
};
