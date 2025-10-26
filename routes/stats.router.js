const Express = require('express');
const router = Express.Router();

const StatsController = require('../controllers/stats.controller');
const { authentication, authorization } = require('../middlewares/auth.middleware');



/*
Routes
*/ 


//GET ROUTES
//Stats for bar chart
router.get('/bar',authentication,authorization('read_stats'),StatsController.barChartStats);

//Stats for pie chart
router.get('/circular',authentication,authorization('read_stats'),StatsController.circularChartStats);

router.get('/cross',authentication,authorization('read_stats'),StatsController.crossFilterStats);

module.exports = router;