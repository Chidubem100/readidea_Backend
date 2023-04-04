const crypto = require('crypto');


const hashString = (String) =>{
    crypto.createHash('md5').update(string).digest('hex');
}


module.exports = hashString;