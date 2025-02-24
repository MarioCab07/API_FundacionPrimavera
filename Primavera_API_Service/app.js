const express = require ('express');
const path = require ('path');
const cookieParser = require ('cookie-parser');
const logger = require ('morgan');
const database = require ('./config/database.config.js');
const errorMiddleware = require ('./middlewares/error.middleware.js');



const apiRouter = require ('./routes/index.router.js');



const app = express();


//Database connection
database.connect();

//Logger -> request
app.use(logger('dev'));

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static routes
app.use(express.static(path.join(__dirname, 'public')));

//API Router

app.use('/api/v1', apiRouter);

//Error middleware
app.use(errorMiddleware);

module.exports =  app;
