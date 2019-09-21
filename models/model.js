const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


//Definimos el esquema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


// hash = llama la cadena que esta encriptada 10 es el grado de encriptación
UserSchema.pre('save', async function(next){
    const user = this;
    const hash = await bcrypt.hash(this.password,10);

    this.password = hash;

    next();
});

//comparar el hash con el password de la base de datos
UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;