const Moongose =require('mongoose')  ;
const debug =require('debug')('app:database');


const dbHost = process.env.DB_HOST ; 
const dbPort = process.env.DB_PORT ;
const dbName = process.env.DB_NAME ;

const dbURI = process.env.DB_URI || "mongodb+srv://MarioCab07:D554B8F8mcd@cluster0.71oqw.mongodb.net/" ;

/*
    Database connection method
*/

const connect = async () => {

    try {
    
    await Moongose.connect(dbURI);
    debug("Database connected");
    } catch (error) {
        console.error(error);
        debug("Cannot connect to Database " + error);
        process.exit(1); 
    }
};

/*
    Database disconnection method
*/
const disconnect = async () => {

try {
    await Moongose.disconnect();
    debug("Database disconnected");
    }catch (error) {
        process.exit(1);
    }

};


module.exports= {
    connect,
    disconnect
};