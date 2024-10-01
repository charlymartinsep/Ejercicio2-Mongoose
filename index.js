const mongoose = require('mongoose');
const readline = require('readline');

// URI de conexión a la base de datos
const uri = 'mongodb://localhost:27017/myfirstdatabase';

// Conectar a MongoDB
mongoose.connect(uri, {});

// Definición de esquemas y modelos
const schema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Document = mongoose.model('Document', schema);

const secondSchema = new mongoose.Schema({
    nombre: String,
    sinopsis: String,
    valoracion: Number
});

const Pelicula = mongoose.model('Pelicula', secondSchema);

// Crear interfaz para la entrada de datos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para elegir la colección
function chooseCollection(callback) {
    console.log("\nSeleccione una colección:");
    console.log("1. Documentos");
    console.log("2. Películas");
    
    rl.question("Ingrese su opción: ", (collectionOption) => {
        if (collectionOption === '1') {
            callback(Document); // Pasar el modelo Document
        } else if (collectionOption === '2') {
            callback(Pelicula); // Pasar el modelo Pelicula
        } else {
            console.log("Opción no válida. Intente nuevamente.");
            chooseCollection(callback);
        }
    });
}

// Función para guardar un documento o película
async function saveDocument(collection) {
    try {
        if (collection === Document) {
            rl.question("Ingrese el nombre del documento: ", async (name) => {
                const existingDoc = await collection.findOne({ name: name });
                if (existingDoc) {
                    console.log("Error: Ya existe un documento con ese nombre.");
                    showMenu(); 
                    return;
                }

                rl.question("Ingrese la descripción del documento: ", (description) => {
                    rl.question("Ingrese el precio del documento: ", async (price) => {
                        const doc = new Document({
                            name: name,
                            description: description,
                            price: Number(price)
                        });

                        const result = await doc.save(); 
                        console.log(result);
                        console.log("Guardado correctamente");
                        showMenu();
                    });
                });
            });
        } else if (collection === Pelicula) {
            rl.question("Ingrese el nombre de la película: ", async (nombre) => {
                const existingDoc = await collection.findOne({ nombre: nombre });
                if (existingDoc) {
                    console.log("Error: Ya existe una película con ese nombre.");
                    showMenu(); 
                    return;
                }

                rl.question("Ingrese la sinopsis de la película: ", (sinopsis) => {
                    rl.question("Ingrese la valoración de la película: ", async (valoracion) => {
                        const peli = new Pelicula({
                            nombre: nombre,
                            sinopsis: sinopsis,
                            valoracion: Number(valoracion)
                        });

                        const result = await peli.save(); 
                        console.log(result);
                        console.log("Guardado correctamente");
                        showMenu();
                    });
                });
            });
        }
    } catch (err) {
        console.error("Error al guardar el objeto:", err);
        showMenu(); 
    }
}

// Función para borrar un objeto por su nombre
async function deleteDocumentByName(collection, name) {
    try {
        const result = await collection.deleteOne({ name: name });  
        if (result.deletedCount > 0) {
            console.log("Objeto borrado correctamente.");
        } else {
            console.log("No se encontró un objeto con ese nombre.");
        }
    } catch (err) {
        console.error("Error al borrar el objeto:", err);
    }
    showMenu(); // Asegurar que el menú se muestra de nuevo tras la eliminación
}

// Función para listar todos los documentos
async function listDocuments(collection) {
    try {
        const documents = await collection.find();

        if (documents.length > 0) {
            console.log("Lista de objetos:");
            documents.forEach(doc => {
                console.log(doc);
            });
        } else {
            console.log("No hay objetos en la colección.");
        }
    } catch (err) {
        console.error("Error al listar:", err);
    }
    // Mostrar el menú después de listar
    showMenu(); 
}

// Función para actualizar un objeto por su nombre
async function updateDocumentByName(collection, name, updatedData) {
    try {
        const result = await collection.findOneAndUpdate({ name: name }, updatedData, { new: true });
        if (result) {
            console.log("Objeto actualizado correctamente:", result);
        } else {
            console.log("No se encontró un objeto con ese nombre.");
        }
    } catch (err) {
        console.error("Error al actualizar el objeto:", err);
    }
    showMenu(); // Mostrar menú tras actualizar
}

// Función para mostrar el menú
function showMenu() {
    console.log("\nSeleccione una opción:");
    console.log("1. Crear un objeto");
    console.log("2. Listar los objetos");
    console.log("3. Actualizar un objeto");
    console.log("4. Borrar un objeto");
    console.log("5. Salir");
    
    rl.question("Ingrese su opción: ", async (option) => {
        switch (option) {
            case '1':
                chooseCollection(saveDocument);
                break;
            case '2':
                chooseCollection(listDocuments);
                break;
            case '3':
                chooseCollection(async (collection) => {
                    rl.question("Ingrese el nombre del documento a actualizar: ", (name) => {
                        rl.question("Ingrese el nuevo precio o valoración: ", async (price) => {
                            await updateDocumentByName(collection, name, { price: Number(price) });
                        });
                    });
                });
                break;
            case '4':
                chooseCollection(async (collection) => {
                    rl.question("Ingrese el nombre del documento a borrar: ", async (name) => {
                        await deleteDocumentByName(collection, name);
                    });
                });
                break;
            case '5':
                console.log("Saliendo...");
                rl.close();
                return; 
            default:
                console.log("Opción no válida. Intente nuevamente.");
                showMenu(); 
        }
    });
}

// Iniciar el menú
showMenu();
