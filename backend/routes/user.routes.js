const router = require('express').Router();
const controller = require('../controller/user');
const auth = require('../middlewares/auth');

// signup
router.post('/signup', controller.signup);

//login
router.post('/login', controller.login);

// add contact
router.post('/add/:userID', auth, controller.addContact);

// display profile
router.get('/profile', auth, controller.displayProfile);

// remove from contact
router.get('/delete/:userID', auth, controller.deleteContact);