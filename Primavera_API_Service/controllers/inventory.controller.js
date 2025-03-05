const path = require('path');
const fs = require('fs-extra');


const Inventory = require('../models/inventory.model');

const debug = require('debug')('app:inv-controller');

const controller = {};

controller.createItem = async(req,res,next)=>{
    try {
        const {product, quantity, price, description, category, state, provider, origin, acquisition_date} = req.body;

        const item = await Inventory.findOne({product:product});
        if(item){
            return res.status(409).json({error:"Product already exists"});
        }

        const newItem = new Inventory({
            product,
            quantity,
            price,
            description,
            category,
            state,
            provider,
            origin,
            acquisition_date
        });

        if(req.file) newItem.image = req.file.path;


        await newItem.save();

        return res.status(201).json({message:"Item created successfully"});

    } catch (error) {
        
    }
}

controller.getAll = async(req,res,next)=>{
    try {
        const {page=1, limit=6} = req.query;
        const items = await Inventory.find().limit(limit * 1).skip((page - 1) * limit);
        const count = await Inventory.countDocuments();
        return res.status(200).json({
            items,
            totalPages: Math.ceil(count/limit),
            currentPage: page
        });
    } catch (error) {
        
    }
}

controller.updateItem = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const {product, quantity, price, description, category, state, provider, origin, acquisition_date} = req.body;
        

        let item = await Inventory.findById(identifier);
        if(!item){
            return res.status(404).json({error:"Item not found"});
        }

        item.product = product;
        item.quantity = quantity;
        item.price = price;
        item.description = description;
        item.category = category;
        item.state = state;
        item.provider = provider;
        item.origin = origin;
        item.acquisition_date = acquisition_date;
        
        await item.save();
        // await item.save();

        return res.status(200).json({message:"Item updated successfully"});

    } catch (error) {
        debug("Error in updateItem", error);
        return next(error);
    }
}

controller.findItem = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const item = await Inventory.findById(identifier);
        if(!item){
            return res.status(404).json({error:"Item not found"});
        }
        return res.status(200).json(item);
    } catch (error) {
        
    }
}

controller.deleteItem = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const item = await Inventory
        .findByIdAndDelete(identifier);
        if(!item){
            return res.status(404).json({error:"Item not found"});
        }

        
        if ( fs.pathExists(item.image)) {
                    fs.remove(item.image);
        }
        return res.status(200).json({message:"Item deleted successfully"});
    } catch (error) {
        
    }
}

controller.getImage = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const item = await Inventory.findById(identifier);
        
        if(!item){
            return res.status(404).json({error:"Item not found"});
        }
        return res.status(200).sendFile(path.resolve(item.image));
    } catch (error) {
        
    }
}

module.exports = controller;
