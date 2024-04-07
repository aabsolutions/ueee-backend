const { Schema, model } = require('mongoose');

const Estudiante_CursoSchema = Schema({

    periodo: {
        type: String,
        required: true
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
},
{
    timestamps: true
});

Estudiante_CursoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Estudiante_curso', Estudiante_CursoSchema);