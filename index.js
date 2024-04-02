// instalar paquete de express
// npm install express --save
const express = require('express');
const cors = require('cors');

//llamamos a nuestras variables de entorno
require('dotenv').config();
//se declara la conexión para la base de datos
const { dbConection } = require('./database/config');
//declaracion para crear el servidor de express
const app = express();
//configuracion de cors
app.use(cors());

//lectura y parseo del body
app.use(express.json());

//rutas
app.use('/api/busqueda', require('./routes/busquedas'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/estudiantes',require('./routes/estudiantes'));
app.use('/api/login',require('./routes/auth'));
app.use('/api/ofertas', require('./routes/ofertas'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/usuarios',require('./routes/usuarios'));


dbConection();

//escucha del servidor express
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: '+ process.env.PORT);
}
);