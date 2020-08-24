const express = require('express');
const router = express.Router();


router.get('/get', (req, res, next) => {

    res.json('{data: "payload"}')
})

module.exports = router;