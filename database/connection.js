const mongoose = require('mongoose');

/**
 * Connect to the MongoDB database
 * @return {Promise<void>}
 */
const connection = async () => {
  try {
    /**
     * Connect to the MongoDB database
     * @constant
     * @type {string}
     */
    const DATABASE_URL = "mongodb://127.0.0.1:27017/portafolio";

    await mongoose.connect(DATABASE_URL);
    console.log('Database connected');
  } catch (error) {
    console.log(error);
    throw new Error('Trouble connecting to the database');
  }
}


module.exports = connection;