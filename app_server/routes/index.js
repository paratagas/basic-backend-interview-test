var express = require('express');
var router = express.Router();
var ctrlMain= require('../controllers/main');

// url example: http://localhost:4488
router.get('/', ctrlMain.home);

// url example: http://localhost:4488/neo/hazardous
router.get('/neo/hazardous', ctrlMain.hazardous);

// url example: http://localhost:4488/neo/fastest?hazardous=true
router.get('/neo/fastest', ctrlMain.fastest);

// url example: http://localhost:4488/neo/best-year?hazardous=false
router.get('/neo/best-year', ctrlMain.bestYear);

// url example: http://localhost:4488/neo/best-month?hazardous=true
router.get('/neo/best-month', ctrlMain.bestMonth);

module.exports = router;
