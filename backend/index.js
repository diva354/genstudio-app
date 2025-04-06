require('dotenv').config();
require('./tracing');
const express = require('express');
const convertNumberToRoman = require('./convert');
const { httpRequestCounter, register } = require('./metrics');
const logger = require('./logger');
const app = express();
const cors = require('cors');
const port = 8080;
app.use(cors());

app.use((req, res, next) => {
    res.on('finish', () => {
      httpRequestCounter.inc({
        method: req.method,
        route: req.path,
        statusCode: res.statusCode,
      });
    });
    next();
  });
app.get('/romannumeral', (req, res) => {
    const queryInp = req.query.query;
    const num = parseInt(queryInp);

    if(!queryInp || isNaN(num)){
        logger.warn('Invalid Input');
        return res.status(400).json({
          errorMessage: 'Invalid input. Input must be whole number between 1 and 3999',
          statusCode: 400
        });
    }
    

    if(num < 1 || num > 3999) {
        logger.warn('Invalid Input');
        return res.status(400).json({
            errorMessage: 'Input out of range. Input must be between 1 and 3999',
            statusCode: 400
        });
    }

    try {
        const romanNumeral = convertNumberToRoman(num);
        logger.info(`Converted ${num} to ${romanNumeral}`);
        res.json({ input: String(num), output: romanNumeral });
    } catch (ex) {
        console.error('Error in conversion: ', ex);
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
  

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});