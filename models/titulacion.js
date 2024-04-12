const { Schema, model } = require('mongoose');

const TitulacionSchema = Schema({

    enrolamiento: {
        type: Schema.Types.ObjectId,
        ref: 'Estudiante_curso',
        required: true
    },
    nota_grado: {
        type: String,
        required: true
    },
    acta_public_id: {
        type: String
    },
    acta_secure_url: {
        type: String
    },
    titulo_public_id: {
        type: String
    },
    titulo_secure_url: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
},
{
    timestamps: true
});

TitulacionSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Titulacion', TitulacionSchema);