const { Schema, model } = require('mongoose');

const EspecialidadSchema = Schema({
    nombreCorto: {
        type: String,
        required: true
    },
    nombreLargo: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});

EspecialidadSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Especialidad', EspecialidadSchema);