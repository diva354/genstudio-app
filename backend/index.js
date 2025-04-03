require('dotenv').config();

const express = require('express');
const convertNumberToRoman = require('./convert');
const app = express();
const cors = require('cors');
const port = 8080;
app.use(cors());


app.get('/romannumeral', (req, res) => {
    const queryInp = req.query.query;
    const num = parseInt(queryInp);

    if(!queryInp || isNaN(num)){
        return res.status(400).json({
          errorMessage: 'Invalid input. Input must be whole number between 1 and 3999',
          statusCode: 400
        });
    }
    

    if(num < 1 || num > 3999) {
        return res.status(400).json({
            errorMessage: 'Input out of range. Input must be between 1 and 3999',
            statusCode: 400
        });
    }

    try {
        const romannumeral = convertNumberToRoman(num);
        res.json({ input: String(num), output: romannumeral });
    } catch (ex) {
        console.error('Error in conversion: ', ex);
        return res.status(500).json({
            errorMessage: 'Internal server error.',
            statusCode: 500,
        });
    }
    
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});