function convertNumberToRoman(num){
    let output = '';
    if(!num || isNaN(num) || num < 1 || num > 3999) {
        throw new Error('Invalid Input number'); // Parameter check to do validation on the business logic 
    }
    const romanMap = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    }
    for(let key in romanMap){
        while(num >= romanMap[key]){
            output += key;
            num -= romanMap[key];
        }
    }
    return output;
}

module.exports = convertNumberToRoman;