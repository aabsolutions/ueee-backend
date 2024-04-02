const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    grado: {
        type: Schema.Types.ObjectId,
        ref: 'Grado'
    },
    especialidad: {
        type: Schema.Types.ObjectId,
        ref: 'Especialidad'
    },
    paralelo: {
        type: String,
        required: true
    },
    jornada: {
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
},
{
    timestamps: true
});

CursoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Curso', CursoSchema);