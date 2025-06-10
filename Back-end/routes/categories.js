const express = require('express');
const {
  getCategories,
  getPostsByCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/',          getCategories);      
router.get('/:id/posts', getPostsByCategory);  
module.exports = router; 
