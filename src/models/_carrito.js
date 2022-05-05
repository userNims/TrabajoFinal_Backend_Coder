const Container = require('./container.js');
const {productos} = require('./_productos.js');
const path = require('path');
const fs = require('fs');

function timestamp(){
    const date = new Date();
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString(); 
}

class Carrito extends Container {
    constructor(path){
        super(path);
    }

    createCart(){
        const date = new Date();
        const actual = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let cartList = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        
        console.log('Lista:', cartList);

        this.lastID++;
        console.log(this.lastID);

        let cartToAdd = {
            id: this.lastID,
            timestamp: actual
        }
        
        cartList.push(cartToAdd);
        console.log(cartList);

        try {
            fs.writeFileSync(this.path, JSON.stringify(cartList, null, 2));
            console.log(`Arhivo correctamente añadido a ${this.path}`);
            return cartToAdd.id;
        } catch(error) {
            console.log('Error: no se pudo añadir el objeto al carrito.');
            return { error : 'Carrito no creado'}
        }
    }

    addToCart(idProduct, idCart){
        let productoToAdd = productos.getById(idProduct);
        let cartList = JSON.parse(fs.readFileSync(this.path, 'utf-8'));

        let auxList = [];
        cartList.forEach( carrito => {
            if(carrito.id == idCart) {
                if(carrito.listaP){
                    auxList = carrito.listaP;
                }
                let flag = true;
                auxList.forEach(producto => {
                    if (producto.id == productoToAdd.id){
                        producto.quantity += 1;
                        flag = false;
                        carrito.timestamp = timestamp();
                    }
                });

                if (flag) {
                    productoToAdd.quantity = 1;
                    if (productoToAdd.stock) {
                        delete productoToAdd.stock;
                        delete productoToAdd.timestamp;
                    }
                    auxList.push(productoToAdd);
                    carrito.timestamp = timestamp();
                }

                console.log(auxList);
                carrito = Object.assign(carrito, { listaP: auxList });
                console.log('carrito: ', carrito); 
            }
        });

        if (productoToAdd.error){
            return productoToAdd.error;
        } else {
            try {
                fs.writeFileSync(this.path, JSON.stringify(cartList, null, 2));
                console.log(`Arhivo correctamente añadido a ${this.path}`);
            } catch(error) {
                console.log('Error: no se pudo añadir el objeto al carrito.');
            }
        }
    }

    showCartItem(idCart){
        let cartToShow = this.getById(idCart);
        if (cartToShow.listaP){
            return cartToShow.listaP;
        } else {
            return cartToShow.error;
        }
    }

    deleteFromCart(idProducto, idCart){
        let cartList = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        let flagNoEntry = false;

        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                let indexProduct = carrito.listaP.findIndex(producto => producto.id == idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagNoEntry = true;
                } else {
                    carrito.listaP.forEach(producto => {
                        if(producto.id == idProducto){
                            if(producto.quantity > 1){
                                producto.quantity--;
                            } else if (producto.quantity == 1){
                                carrito.listaP.splice(indexProduct, 1);
                            } 
                        }
                    });
                }
                
            }
        });

        if (flagNoEntry){
            console.log('Producto no disponible');
            return { error: "Producto no disponible"};
        } else {
            try {
                fs.writeFileSync(this.path, JSON.stringify(cartList, null, 2));
                console.log(`Arhivo correctamente añadido a ${this.path}`);
                return { status: "Arhivo correctamente añadido a ${this.path}"};
            } catch(error) {
                console.log('Error: no se pudo añadir el objeto al carrito.');
                return { error: "Producto no disponible"};
            }
        }

    }

    deleteAllFromCart(idCart) {
        let cartList = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        let flagNoEntry = true;

        cartList.forEach(carrito => {
            if(carrito.id == idCart){
                carrito.listaP = [];
                flagNoEntry = false;
            }
        })

        if (flagNoEntry) {
            console.log('Carrito no disponible');
            return { error: "Carrito no disponible"};
        } else {
            try {
                fs.writeFileSync(this.path, JSON.stringify(cartList, null, 2));
                console.log(`Todos los productos han sido eliminados.`);
            } catch(error) {
                console.log('Error: no se pudo borrar los objetos del carrito.');
            }
        }

    }
}

let directorioJson = path.join(__dirname, '..', 'data/carrito.json');
let carrito = new Carrito(directorioJson);
// console.log(carrito.showCartItem(16));

// carrito.deleteAllFromCart(9);
// carrito.deleteFromCart(2, 1);
// carrito.createCart();
// carrito.addToCart(1,1);
// carrito.addToCart(3,1);
// carrito.addToCart(2,1);
// carrito.addToCart(2,1);

module.exports = carrito;