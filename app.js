const express = require ('express');
const path = require ('path');
const cookieParser = require ('cookie-parser');
const logger = require ('morgan');
const mongoSanitize = require ('express-mongo-sanitize');
const cors = require ('cors');


const database = require ('./config/database.config.js');
const errorMiddleware = require ('./middlewares/error.middleware.js');



const apiRouter = require ('./routes/index.router.js');



const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(mongoSanitize());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

//Database connection
database.connect();

//Logger -> request
app.use(logger('dev'));

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//API Router

app.use('/api/v1', apiRouter);

//Error middleware
app.use(errorMiddleware);

module.exports =  app;
