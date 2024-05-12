require('dotenv').config();
const express = require('express');
const HttpError = require('./utils/http-error');

const app = express();


app.use((req, res, next) => {
    const error = new HttpError(404, "Endpoint Not found");
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).json({ message: error.message });
});

module.exports = app;