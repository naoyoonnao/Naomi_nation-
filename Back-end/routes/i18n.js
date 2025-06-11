const express = require('express');
const ctrl = require('../controllers/i18nController');
const router = express.Router();

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:key', ctrl.update);
router.delete('/:key', ctrl.remove);
router.get('/file/:lng', ctrl.sendFile);

module.exports = router;
