const Product = require('../models/productModel');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) =>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }catch(error){
        throw new Error(error);
    }
});

//Get a product

const getaProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    
    try{
        const findProduct = await Product.findById(id);
        res.json({findProduct});
    }catch(err){
        throw new Error(err);   
    }
});

//Get All Product

const getAllProduct = asyncHandler(async (req, res) => {
    try{
        //Filtering
        const queryObj = {...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //Sroting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy)
        }else{
            query = query.sort("-createdAt");
        }
        
        //limiting the fields

        if(req.query.fields){
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1 ) * limit;

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This page does not exists.");
        }
        
        query = query.skip(skip).limit(limit);

        const products = await query;
        res.json(products);
    }catch(err){
        throw new Error(err);
    }
});

//Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const updatePro = await Product.findByIdAndUpdate(
            id, req.body,{
                new: true
            }
        );
        res.json(updatePro);
    }catch(err){
        throw new Error(err);
    }
});

//Delete product

const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{    
        const deletePro = await Product.findByIdAndDelete(id);
        res.json(deletePro);
    }catch(err){
        throw new Error(err);
    }
});

module.exports = {
createProduct,
getaProduct,
getAllProduct,
updateProduct,
deleteProduct
};