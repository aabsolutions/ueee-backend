const { Schema, model } = require('mongoose');

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
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso'
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