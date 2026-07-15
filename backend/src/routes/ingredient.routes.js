const express = require('express');
const router = express.Router();
const c = require('../controllers/ingredient.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', authorize('Admin', 'Bep'), c.getAllIngredients);
router.post('/', authorize('Admin'), c.createIngredient);
router.put('/:id', authorize('Admin'), c.updateIngredient);
router.patch('/:id/status', authorize('Admin'), c.updateIngredientStatus);
router.delete('/:id', authorize('Admin'), c.deleteIngredient);

module.exports = router;