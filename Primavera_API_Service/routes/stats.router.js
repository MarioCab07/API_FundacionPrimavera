const Express = require('express');
const router = Express.Router();

const StatsController = require('../controllers/stats.controller');
const { authentication, authorization } = require('../middlewares/auth.middleware');



/*
Routes
*/ 


//GET ROUTES
//General Stats
router.get('/general',authentication,authorization('read_stats'),StatsController.generalStats);

//Age Stats
router.get('/age',authentication,authorization('read_stats'),StatsController.ageStats);

//Phone Stats
router.get('/phone',authentication,authorization('read_stats'),StatsController.phoneStats);

//House Type Stats
router.get('/house',authentication,authorization('read_stats'),StatsController.houseStats);

//Income Level Stats
router.get('/income',authentication,authorization('read_stats'),StatsController.incomeStats);


module.exports = router;