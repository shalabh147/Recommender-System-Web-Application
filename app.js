
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRo = require('./routes/admin');
const nonadminRo = require('./routes/nonadmin');
const pool =  require('./utils/database');


const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
// var popup = require('popups')
// app.use()
const popup = require('node-popup');

const session = require('express-session');
app.use(session({secret: 'abc'}));

app.use('/admin',adminRo);
app.use('/',nonadminRo);


app.listen(3000);