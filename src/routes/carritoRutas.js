// ................. Importing Assets .................
const carrito = require('../models/_carrito');
const producto = require('../models/_productos');

const express = require('express');
const { Router } = express;
const cartRouter = Router();

// ................. Initial Configuration .................



// ................. Routes Configuration .................
// Devuelve todos los productos
cartRouter.get('/', (req, res) => {
    let producto = carrito.getAll();
    res.json({producto});
});

// Muestra los productos de un carrito especifico
cartRouter.get('/:id/productos', (req,res)=>{
    let id = req.params.id;
    let carritoProductos = carrito.showCartItem(id);
    res.send(carritoProductos);
});
    
// Añade un producto a un carrito nuevo o existente
cartRouter.post('/', (req,res)=>{
    let requireProductID = req.body.idProduct;
    let requireCartID = req.body.idCarrito;
    console.log('IDDDD: ', requireProductID, requireCartID);

    carritoTemp = carrito.getById(requireCartID);

    if (carritoTemp.id) {
        carrito.addToCart(requireProductID, requireCartID);
        res.send(`ID asignado al carrito: ${requireCartID}`);
    } else {
        let carritoNuevoID = carrito.createCart();
        carrito.addToCart(requireProductID, carritoNuevoID);
        res.send(`Carrito nuevo creado con éxito, ID asignado al carrito: ${carritoNuevoID}`);
    }
});

// Añade un producto especifico a un carrito nuevo o existente
cartRouter.post('/:id/productos/:id_prod', (req,res)=>{
    let requireProductID = req.params.id_prod;
    let requireCartID = req.params.id;

    console.log('IDD: ',requireProductID, requireCartID);

    if (requireProductID && requireCartID) {
        carrito.addToCart(requireProductID, requireCartID);
        res.send(`Producto añadido al carrito con ID ${requireCartID}`);
    } else {
        let carritoNuevoID = carrito.createCart();
        carrito.addToCart(requireProductID, carritoNuevoID);
        res.send(`Carrito nuevo creado con éxito, ID asignado al carrito: ${carritoNuevoID}`);
    }
});

// Elimina un carrito por ID
cartRouter.delete('/:id', (req,res)=>{
    carrito.deleteById(req.params.id);
    res.send(carrito.getAll());
});

// Elimina el producto de un carrito
cartRouter.delete('/:id/productos/:id_prod', (req,res)=>{
    let requireProductID = req.params.id_prod;
    let requireCartID = req.params.id;
    let cartIdTemp = carrito.getById(requireCartID);
    let productIdTemp = carrito.getById(requireCartID);
    console.log('CARRITOOOOOOO: ', cartIdTemp.error);
    // Para mejorar añadir los cambios directamente a _carrito.js
    if (cartIdTemp.error || productIdTemp.error){
        res.send ( {error: 'El carrito ingresado no existe'});
    } else {
        carrito.deleteFromCart(requireProductID, requireCartID);
        res.send(carrito.getAll());
    }
});

module.exports = cartRouter;