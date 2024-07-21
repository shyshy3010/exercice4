const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');

// Route pour obtenir toutes les vacances
router.get('/', vacationController.getVacations);

// Route pour choisir une vacance
router.post('/choose', vacationController.chooseVacation);

// Route pour mettre à jour les détails de la vacance
router.put('/update', vacationController.updateVacationDetails);

// Route pour calculer les résultats des vacances
router.get('/results', vacationController.calculateVacationResults);

module.exports = router;