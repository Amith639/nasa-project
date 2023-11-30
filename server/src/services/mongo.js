const { default: mongoose } = require("mongoose")
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
    console.log('errorrrrrr', err);
});


async function mongoConnect() {
    mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };