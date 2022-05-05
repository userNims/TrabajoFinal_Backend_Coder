// ................. Importing Assets .................
const {Productos} = require('../models/_productos');
const productos = new Productos('./src/data/productos.json');
const fs = require('fs');
const path = require('path');

// Admin JSON
let directorioJson = path.join(__dirname, '..', 'data/user.json');
let adminJSON = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
console.log(adminJSON);

// let productos = new Productos('../data/productos.json');
// console.log(productos.getAll());

const express = require('express');
const { Router } = express;
const productRouter = Router();

// ................. Initial Configuration .................


// ................. Routes Configuration .................
productRouter.get('/', (req, res) => {
    let producto = productos.getAll();

    res.json({producto});
});

productRouter.get('/:id', (req,res)=>{
    let id = req.params.id;
    if (productos.getById(id)){
        res.send(productos.getById(id));
        
    } else {
        res.json({error: "producto no encontrado"});
    }
});
    
productRouter.post('/', (req,res)=>{
    if (adminJSON.admin) {
        let addProducto = productos.saveProduct(req.body);
        console.log(`ID asignado al producto: ${addProducto}`);
        res.send(`ID asignado al producto: ${addProducto}`);
    } else {
        res.send('No es administrador');
    }
});

productRouter.put('/:id', (req,res)=>{
    if (adminJSON.admin){
        let id = req.params.id;
        console.log("ID recibido: " + id);
        let updateObject = productos.updateProductById(id, req.body);
        res.send(updateObject);
    } else {
        res.send('No es administrador');
    } 
});

productRouter.delete('/:id', (req,res)=>{
    if (adminJSON.admin){
        productos.deleteById(req.params.id);
        console.log('ADDDMIIIIIN: ', admin);
        res.send(productos.getAll());
    } else {
        res.send('No es administrador');
    }
});

productRouter.delete('/', (req,res)=>{
    if (adminJSON.admin){
        productos.deleteAll();
        res.send(productos.getAll());
    } else {
        res.send('No es administrador');
    }
});



module.exports = productRouter;