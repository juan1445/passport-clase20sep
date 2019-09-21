const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/model');
const Jwtstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJWt

passport.use(new Jwtstrategy)({
    secretOrKey: "top_secret",
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secrect_token')
}, async (token, done) =>{
    try{
        return done(null,token,user);
    }catch(error){
        done(error);
    }
});

passport.use('signup', new localStrategy({
    // estos parametros ya los trae passport, ya estan definidos
    isernameField: "email",
    passwordField: "password"
},
    async (email, password, done) => {
        //intente ejecutar esto.
        try {
            //llamamos nuestro model
            const user = await UserModel.create({
                email,
                password
            });
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
));

passport.use('login', new localStrategy({
    usernameField: "email",
    passwordField: "password"
},
    async (email,password,done) =>{
        try{
            const user = await UserModel.findOne({
                email
            });
            if(!user){
                return done(null,false, {message: "user no found"});
            }
            const validate = await user.isValidPassword(password);

            if(!validate){
                return done(null, false, {message: "incorrect pasword"});
            }

            return done(null, user, {message: "logged successfully"});

        }catch(error){
            return done(error);
        }
    }
))

module.exports = passport;