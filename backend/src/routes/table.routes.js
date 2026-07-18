const express = require('express');
const router = express.Router();
const c = require('../controllers/table.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/zones', authorize('Admin', 'Phuc_vu', 'Thu_ngan'), c.getZonesList);
router.get('/', authorize('Admin', 'Phuc_vu', 'Thu_ngan'), c.getAllTables);
router.post('/', authorize('Admin'), c.createTable);
router.put('/:id', authorize('Admin'), c.updateTable);
router.delete('/:id', authorize('Admin'), c.deleteTable);

module.exports = router;