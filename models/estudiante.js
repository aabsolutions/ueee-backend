const { Schema, model } = require('mongoose');
const { boolean } = require('webidl-conversions');

const EstudianteSchema = Schema({

    cedula: {
        type: String,
        required: true,
        unique: true
    },
    apellidos: {
        type: String,
        required: true
    },
    nombres: {
        type: String,
        required: true
    },
    f_nac: {
        type: String,
        required: true
    },
    sexo: {
        type: Number,
        required: true
    },
    direccion: {
        type: String
    },
    email: {
        type: String
    },
    celular: {
        type: String
    },
    representante_cedula: {
        type: String
    },
    representante_nombre_completo: {
        type: String
    },
    representante_email: {
        type: String
    },
    representante_celular: {
        type: String
    },
    padre_cedula: {
        type: String
    },
    padre_nombre_completo: {
        type: String
    },
    padre_celular: {
        type: String
    },
    madre_cedula: {
        type: String
    },
    madre_nombre_completo: {
        type: String
    },
    madre_celular: {
        type: String
    },
    discapacidad: {
        type: Boolean,
        default: false
    },
    discapacidad_detalle: {
        type: String
    },
    enfermedad_catastrofica: {
        type: Boolean,
        default: false
    },
    enfermedad_catastrofica_detalle: {
        type: String
    },
    alergia: {
        type: Boolean,
        default: false
    },
    alergia_detalle: {
        type: String
    },
    embarazo: {
        type: Boolean,
        default: false
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

EstudianteSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Estudiante', EstudianteSchema);