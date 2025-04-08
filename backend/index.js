require('dotenv').config();
require('./tracing');
const express = require('express');
const convertNumberToRoman = require('./convert');
const { httpRequestCounter, httpResponseTimeHistogram, register } = require('./metrics');
const logger = require('./logger');
const app = express();
const cors = require('cors');
const port = 8080;
app.use(cors());

app.use((req, res, next) => {
    const end = httpResponseTimeHistogram.startTimer(); //  Start timing
    res.on('finish', () => {
        const labels = {
            method: req.method,
            route: req.path,
            statusCode: res.statusCode,
        };
        httpRequestCounter.inc(labels);       // Count request
        end(labels);                          // Record response time
    });
    next();
  });
app.get('/romannumeral', (req, res) => {
    const queryInp = req.query.query;
    const num = parseInt(queryInp);

    if(!queryInp || isNaN(num)){
        logger.warn('Invalid Input - Not an Integer');
        // In case, backend receives bad input - second layer of validation 
        return res.status(400).json({
          errorMessage: 'Invalid input. Input must be whole number between 1 and 3999',
          statusCode: 400,
          field: "query" // In order to differentiate between input or system level errors
        });
    }
    

    if(num < 1 || num > 3999) {
        logger.warn('Invalid Input - Out of range');
        // In case, backend receives bad input - second layer of validation
        return res.status(400).json({
            errorMessage: 'Input out of range. Input must be between 1 and 3999',
            statusCode: 400,
            field: "query" // In order to differentiate between input or system level errors
        });
    }

    try {
        const romanNumeral = convertNumberToRoman(num);
        logger.info(`Converted ${num} to ${romanNumeral}`);
        res.json({ input: String(num), output: romanNumeral });
    } catch (ex) {
        console.error('Error in conversion: ', ex);
        // In case of any failure in conversion or convert.js responding with invalid json
        logger.error('Failure in conversion');
        return res.status(500).json({
            errorMessage: 'Internal server error.',
            statusCode: 500,
        });
    }
    
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  
app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});