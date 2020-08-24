const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require("path");
const port = process.env.PORT || '3000';
const cors = require('cors')


const app = express();
app.use(cors());
app.options('*', cors()); // include before other routes
// Initialize session
app.use(session(
    {
        secret: 'S3CRE7',
        resave: true,
        saveUninitialized: true
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Get our API routes
const api = require('./api');
// Set our api routes
app.use('/api', api);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () =>
    console.log('Express server is running on localhost:' + port)
);