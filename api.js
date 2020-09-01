const express = require('express');
const pool = require('./db');
const router = express.Router();


const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const bluebird = require('bluebird');
const multiparty = require('multiparty');


// configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
  });
  
  // configure AWS to work with promises
  AWS.config.setPromisesDependency(bluebird);
  
  // create S3 instance
  const s3 = new AWS.S3();


// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    console.log(name, type)
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: type.mime,
      //Key: `${name}.${type.ext}`
      Key: `${name}`
    };
    return s3.upload(params).promise();
  };

router.get('/get', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        "key": "value"
    })
})

const getFileType = async (path) => {
    try{
        const buffer = readChunk.sync(path, 0, 4100)
        console.log('buffer 2', buffer)        
        const type = await fileType.fromBuffer(buffer)
        console.log('file type', type)
        return type
    } catch(ex) {
        console.log('exception', ex)
    }
}

// Define POST route
router.post('/upload', (request, response, next) => {
    console.log('upload process started', '... please wait')
    const form = new multiparty.Form();
    //console.log('form', form)
      form.parse(request, async (error, fields, files) => {
        if (error) throw new Error(error);
        try {
            console.log('original file name : ', files.file[0].originalFilename)
            const originalFileName = files.file[0].originalFilename
            const fileExtenstion = files.file[0].originalFilename.split('.').pop();
            console.log('original file ext : ', fileExtenstion)
            const path = files.file[0].path;
            console.log('path', path)
            const buffer = fs.readFileSync(path);
            console.log('buffer 1', buffer)
            //const type = fileType(buffer);
            const type = getFileType(path)
            .then((res) => {
                console.log('file type res', res)
            })
            .catch(() => {
                console.log('file type err', 'error getting file type')
            })
            const timestamp = Date.now().toString();
            console.log('timestamp', timestamp)
            const fileName = `bucketFolder/${originalFileName}`;
            console.log('file name', fileName)
          
            const data = await uploadFile(buffer, fileName, fileExtenstion);
            console.log('success')
            insert(data)
            return response.status(200).send(data);
        } catch (error) {
            console.error('error')
          return response.status(400).send(error);
        }
      });
  });
// router.get('/files', (req, res, next) => {
//     console.log('Server: /api/files', 'Getting files from server')
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json([
//         {
//             "name": "test.doc",
//             "url": "https://localhost:3000/api/files/test.doc"
//         },
//         {
//             "name": "test2.doc",
//             "url": "https://localhost:3000/api/files/test2.doc"            
//         }    
//     ])
// })


const insert = async (data) => {
    try{
        console.log('name', data.key);
        console.log('url', data.Location)
        let sql = "insert into salesforce.files(etag,key,object_url) values('" + data.etag + "','" + data.key + "','" + data.Location + "') RETURNING file_id"
        console.log(sql);

        await pool
            .query(sql)
            .then(result => {
                console.log('inserting data ...please wait')
                console.log('data', result)
                console.log('inserting data ...success')
                return result;
            })
            .catch(err => console.error('Error executing query', err.stack))        

    }catch(ex) {
        console.log('error inserting data ', ex)
    }
}

/* GET users listing. */
router.get('/files', async (req, res, next) => {
    try{
        let sql = 'select file_id, key, object_url from salesforce.files order by file_id desc';
        console.log('query : ', sql)
        await pool
            .query(sql)
            .then(result => {
                console.log('fetching data ...please wait')
                console.log('data', result.rows)
                console.log('fetched data ...success')
                res.status(200).json(result.rows);
            })
            .catch(err => console.error('Error executing query', err.stack))

    }catch(err) {
        console.error(err.message);
    }
});

module.exports = router;