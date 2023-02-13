const path = require('path');
const fs = require('fs');
module.exports = {
    key: fs.readFileSync(path.join(__dirname, './textdrip_com.key')),
    cert: fs.readFileSync(path.join(__dirname, './textdrip_com.crt')),
    ca: fs.readFileSync(path.join(__dirname, './textdrip_com.ca-bundle'))
};