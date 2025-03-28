const Moongose =require('mongoose')  ;
const debug =require('debug')('app:database');



const dbURI = process.env.DB_URI ;

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