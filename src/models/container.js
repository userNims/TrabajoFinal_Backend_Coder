const fs = require('fs');

class Contenedor {

    constructor(path){
        this.path = path;
        this.JSONcheck();
        this.lastID;
    }

    // static workFile = this.path;

    JSONcheck(){
        console.log(this.path);
        try {
            fs.readFileSync(this.path,'utf-8');
            console.log('encontrado');
        } catch (error) {
            fs.writeFileSync(this.path, '[]');
            console.log('creado con exito!');
        }

/* a continuacion se lee el ID mayor en el archivoTest pasado al crear la clase. Luego 
guarda ese ID en lastID para su posterior uso en los demás módulos. */

        let array = JSON.parse(fs.readFileSync(this.path,'utf-8'));
        let idAux = [];
        array.forEach(element => {
            idAux.push(element.id);
        });
        this.lastID = Math.max(...idAux);
        if(this.lastID === -Infinity){
            this.lastID = 0;
            console.log(this.path,' está vacío');
        } else {
            console.log(`ID mayor del archivo ingresado: ${this.lastID}`)
        }
    }

    // SAVE PRODUCT
    save(object){
        let array = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        this.lastID ++;
        object.id = this.lastID;
        array.push(object);
        try {
            fs.writeFileSync(this.path, JSON.stringify(array, null, 2));
            console.log(`Arhivo correctamente añadido a ${this.path}`);
        } catch(error) {
            console.log('Error: no se pudo guardar el objeto');
        }
        console.log(`ID asignado para: ${object.id}`);
        return object.id;
    }

    // GET BY ID
    getById(number){
        let objectAux;
        let array = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        array.forEach( item => {
            if(item.id == number){
                objectAux = item;
            }
        });
        if(objectAux === undefined){
            console.log(`El ID ${number} no existe.`);
            return { error: 'Producto no encontrado' };
        } else {
            console.log('Objeto solicitado: \n',objectAux);
            return objectAux;
        }
    }

    // UPDATE BY ID
    updateById(id, objectToUpdate){
    
        let array = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        let objectIndex = array.findIndex(object => object.id == id);

        objectToUpdate.id = id;
        array[objectIndex] = objectToUpdate;
        
        fs.writeFileSync(this.path, JSON.stringify(array, null, 2));
        return array;
    }

    // GET ALL
    getAll(){
        let todo, flag;
        try {
            todo = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            flag = true;
        } catch (error) {
            flag = false;
        }
        if (flag === true){
            return todo;
        } else if (flag === false){
            return 'error con al mostrar todos los objetos';
        }
    }

    // DELETE BY ID
    deleteById(number){
        let array = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        let idObject = array.findIndex(object => object.id == number);
        if (idObject === -1){
            console.log('El indice indicado no existe');
        } else {
            array.splice(idObject, 1);
            fs.writeFileSync(this.path, JSON.stringify(array, null, 2));
            console.log(`El objeto con ID ${number} fue eliminado exitosamente.`);
        }
    }

    // DELETE ALL
    deleteAll(){
        const arrayVacio = [];
        try {
            fs.writeFileSync(this.path, JSON.stringify(arrayVacio));
            console.log('Todos los objetos en',this.path,'fueron borrados');
        } catch (error) {
            console.log('Error: no se pudo borrar los datos');
        }
    }
}

// let libreria = new Contenedor("libreria");

// let newProducto1 = {
//     title: "lapiz",
//     price: 20,
//     thumbnail: "google.com/img_lapiz"
// }

// let newProducto2 = {
//     title: "cartulina",
//     price: 80,
//     thumbnail: "google.com/img_cartulina"
// }

// let newProducto3 = {
//     title: "paz mundial",
//     price: 80,
//     thumbnail: "google.com/img_cartulina"
// }

// // Uso del método "save"
// libreria.save(newProducto2);

// // Uso del método getById
// libreria.getById(19);

// // Uso del método getAll
// libreria.getAll();

// // Uso del método deleteById
// libreria.deleteById(19);

// // Uso del método deleteAll
// // libreria.deleteAll();

// // Uso del método deleteAll
// console.log(libreria.updateById(1, newProducto3));;

module.exports = Contenedor;