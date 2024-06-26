const { Schema, model } = require('mongoose');

const Estudiante_ImcSchema = Schema({

    periodo: {
        type: String,
        required: true
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    peso: {
        type: Number,
        required: true
    },
    talla: {
        type: Number,
        required: true
    },
    fecha_toma: {
        type: String,
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

Estudiante_ImcSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Estudiante_Imc', Estudiante_ImcSchema);