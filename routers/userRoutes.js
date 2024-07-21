const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour enregistrer un nouvel utilisateur
router.post('/register', userController.registerUser);

// Route pour connecter un utilisateur
router.post('/login', userController.loginUser);

// Route pour obtenir les détails de l'utilisateur
router.get('/details', userController.getUserDetails);

// Route pour mettre à jour les détails de l'utilisateur
router.put('/update', userController.updateUserDetails);

module.exports = router;
