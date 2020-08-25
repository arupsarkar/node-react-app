const express = require('express');
const pool = require('./db');
const router = express.Router();


router.get('/get', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        "key": "value"
    })
})

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




/* GET users listing. */
router.get('/files', async (req, res, next) => {
    try{
        let sql = 'select key, object_url from salesforce.files';
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