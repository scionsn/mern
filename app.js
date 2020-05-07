const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(require('./utils/upload')); // Attaching BusBoy as a middleware in app
app.use('/',require('./routes/a')); // Attach a Route
app.listen(1234,()=>{
    console.log('Server Started...');
})
