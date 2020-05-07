const Busboy  = require('busboy');
const path = require('path');
const fs = require('fs');
// this is a middleware
function uploadFile (req, res, next) {
    console.log('Content Type is ',req.headers);
    // 5000 bytes
    var busboy = new Busboy({ headers: req.headers,limits:{fileSize:5000} });

    var name ;    
    // Listen for event when Busboy finds a non-file field.
    busboy.on('field', function (fieldname, val) {
            // Do something with non-file field.
            console.log('Field  is ',fieldname,' ANd Value is ',val);
            if(fieldname=='name'){
            name = val;
            }
            console.log('Fields are ',fieldname, ' Val ',val);
    });


    // Listen for event when Busboy finds a file to stream.
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("fieldname is ",fieldname);
        console.log('Mime Type is ',mimetype, " Compare  ",mimetype!="image/jpeg", " Type is ",typeof mimetype);
        // Check Mime Type
        if ("image/png" != mimetype)
        {
           console.log("invalid mimetype"); // that prints ok
           // req.busboy.end();  // I tried that but it doesn't work
           res.send('Invalid File Type Only Accept PNG ');


        }
        // Store / Write a file in Server
        const newPath = path.normalize(__dirname+'/..');
                //var saveTo = path.join(newPath, 'uploads', path.basename(filename));
                console.log("new path is ",newPath);
                var ext = path.extname(filename);
                console.log("extnsn name is ",ext)
                const uuid = require('uuid');
                var no = uuid.v1();
                
                var newfilename = name+no+ext;
                console.log("new file name is ",newfilename)
                var saveTo = path.join(newPath, 'imguploads', newfilename);
                console.log("save to :",saveTo)
                var outStream = fs.createWriteStream(saveTo);
        // We are streaming! Handle chunks
        file.on('data', function (data) {
                // Here we can act on the data chunks streamed.
                console.log("in data event ")
                outStream.write(data);
                
            });

           file.on('limits',(data)=>{
                console.log('Limit Call ',data);
                res.send('File exceed the limit');
           }) 

        // Completed streaming the file.
        // end event tells us if there is no more data to read.
        file.on('end', function (stream) {
            
           
            console.log('File Store');
        });
    });

     
    // Listen for event when Busboy is finished parsing the form.
    busboy.on('finish', function () {
        res.statusCode = 200;
        res.end('File Uploaded SuccessFully');
    });

    // Pipe the HTTP Request into Busboy.
    req.pipe(busboy);
};
module.exports = uploadFile;