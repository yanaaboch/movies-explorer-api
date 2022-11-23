const express = require('express');
const { getCurrentUser, updateUserProfile } = require('../controllers/userControllers');
const { validateUpdatingUserInfo } = require('../middlewares/validate-requests');

const userRoutes = express.Router();

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', validateUpdatingUserInfo, updateUserProfile);

module.exports = { userRoutes };
