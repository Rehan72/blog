const express = require('express');
const { authenticateUser } = require('../middelware/auth');
const { signupController, loginController } = require('../controllers/auth.controller');
const { getBlogsController, createBlogController, getBlogByIdController, updateBlogController, deleteBlogController } = require('../controllers/blog.controller');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('welcome to the user routes');
});

// router.get('/signup', (req, res) => {
//     res.send('Signup page - use POST to register');
// });

// router.get('/login', (req, res) => {
//     res.send('Login page - use POST to authenticate');
// });

router.post('/signup', signupController);
router.post('/login', loginController);

// Blog routes
router.post('/create-blog', authenticateUser, createBlogController);
router.get('/blogs', getBlogsController);
router.get('/blogs/:id', getBlogByIdController);
router.put('/blogs/:id', authenticateUser, updateBlogController);
router.delete('/blogs/:id', authenticateUser, deleteBlogController);

module.exports = router;