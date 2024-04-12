const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const app = express()
const mongoose = require("mongoose");
const database = require("./config/database");
const systemConfig = require("./config/system");

require('dotenv').config()

database.connect();

mongoose.connect(process.env.MONGO_URL);

const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

// Flash

app.use(cookieParser('XXXXXXXXXX'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// End Flash

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

  route(app);
  routeAdmin(app);
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })