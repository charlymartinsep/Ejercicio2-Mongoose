const mongoose = require('mongoose')

const uri = 'mongodb://localhost:27017/myfirstdatabase';

mongoose.connect(uri, {
      
});

//Base de datos conectada correctamente
mongoose.connection.on('open', _ =>{
    console.log('Database is connected to', uri );
})

//Error en una conexión
mongoose.connection.on('error', err =>{
    console.log(err)
})