const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', authorize('Admin', 'Bep'), unitController.getAllUnits);
router.post('/', authorize('Admin'), unitController.createUnit);
router.put('/:id', authorize('Admin'), unitController.updateUnit);
router.delete('/:id', authorize('Admin'), unitController.deleteUnit);

module.exports = router;