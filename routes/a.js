const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
router.post('/register',(req,res)=>{
   // res.download(path);
    var name = req.body.name;
    var address = req.body.address;
    console.log('Name '+name+' Address '+address);
    return upload(req,res);

});
module.exports = router;