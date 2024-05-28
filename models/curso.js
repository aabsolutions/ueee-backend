const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    grado: {
        type: String,
        enum: ['8VO GRADO', '9NO GRADO', '10MO GRADO', '1ER CURSO', '2DO CURSO', '3ER CURSO'],
        required: true
    },
    grado_abrev: {
        type: String,
        enum: ['8VO', '9NO', '10MO', '1ER BACH.', '2DO BACH.', '3ER BACH.'],
        required: true
    },
    orden:{
        type: Number,
        default: 0
    },
    nivel: {
        type: String,//EGB SUPERIOR
        enum: ['INICIAL', 'EGB ELEMENTAL', 'EGB MEDIA', 'EGB SUPERIOR', 'BACHILLERATO GENERAL UNIFICADO', 'BACHILLERATO TECNICO'],
        required: true
    },
    nivel_abrev: {
        type: String,//EGB SUP.
        enum: ['INI', 'EGB ELEM.', 'EGB MED.', 'EGB SUP.', 'BGU', 'BT'],
        required: true
    },
    paralelo: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        enum: ['CONTABILIDAD', 'INFORMATICA', 'ELECTROMECANICA','']
    },
    jornada: {
        type: String,
        enum: ['MATUTINA', 'VESPERTINA', 'NOCTURNA'],
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