const express = require('express');
const { authenticateUser } = require('../middelware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from the index route!');
});

router.post('/signup', authenticateUser, singupController);

module.exports = router;