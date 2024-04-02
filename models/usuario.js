const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
},
{
    timestamps: true
});

UsuarioSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;  
})

module.exports = model('Usuario', UsuarioSchema);