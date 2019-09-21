const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const UserModel = require('./models/model');
const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');

mongoose.connect('mongodb://127.0.0.1:27017/passport', {
    userNewUrlParser: true
})
.then(db => console.log("DB is connected"))
.catch(err => console.error(err))

require("./auth/auth");

app.use(bodyParser.urlencoded({extended: false}))

app.use('/', routes);

app.use('/user', passport.authenticate('jwt', {
    session: false
}), secureRoutes);

// sesion para manejar errores
app.use((err, res, req, next) => {
    res.status(err.status || 500);
    res.json({error: err});

})




app.listen(3000, ()=>{
    console.log("server on port 3000")
})