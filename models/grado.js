const { Schema, model } = require('mongoose');

const GradoSchema = Schema({
    nombre: {
        type: String, //8VO
        required: true
    },
    nivelCorto: {
        type: String, //EGB
        enum: ['INI', 'EGB', 'BGU', 'BT'],
        required: true
    },
    nivelLargo: {
        type: String,//EGB SUPERIOR
        enum: ['INICIAL', 'EGB ELEMENTAL', 'EGB MEDIA', 'EGB SUPERIOR', 'BACHILLERATO GENERAL UNIFICADO', 'BACHILLERATO TÉCNICO'],
        required: true
    },
    secuencia: {
        type: Number, //EGB
        min: 1,
        max: 15,
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

GradoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Grado', GradoSchema);