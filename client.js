const https = require('https');
const root = 'https://web-pipe.onrender.com/';


https.get(root + `access?text=cerf`, (res) => {
    let data = [];

    res.on('data', chunk => {
        data.push(chunk);
    });

    res.on('end', () => {
        data = JSON.parse(Buffer.concat(data).toString());
        console.log(data.text);

    });
})