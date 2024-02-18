const Product = require('../models/productModel');
const User = require('../models/userModel');
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

//Add to Wish List

const addToWishLst = asyncHandler(async (req, res) =>{
    const { id } = req.user;
    console.log("fds");
    const { productId } = req.body;
    try{
        const user = await User.findById(id);
        if(!user) throw new Error("User not found");
        const alreadyadded = user.wishlist.find(
            (id)=> id.toString() == productId
        );
        if(alreadyadded){
            let user = await User.findByIdAndUpdate(
                id,
                {
                    $pull: {wishlist:productId}
                },
                {
                    new:true
                }
            );
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(
                id,
                {
                    $push: {wishlist:productId}
                },
                {
                    new:true
                }
            );
            res.json(user);
        }
    }catch(err){
        throw new Error(err);
    }
});


// rating
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId,comment } = req.body;
 
    try{
       
        const product = await Product.findById(productId);
      
        let  alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        //console.log(alreadyRated);
        if(alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated } ,
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment},
                },
                {
                    new: true,
                }
            );
            //res.json(updateRating);
        }else{
            const rateProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        ratings:{
                            star: star,
                            comment:comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true
                }
            );
            //res.json(rateProduct);
        }
        const getallratings = await Product.findById(productId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum/totalRating);
        const finalrating  = await Product.findByIdAndUpdate(
            productId,
            {
            totalRating: actualRating,
            },
            {
                new: true
            }
        )
        res.json(finalrating);
    }catch(err){
        throw new Error(err);
    }
});

module.exports = {
createProduct,
getaProduct,
getAllProduct,
updateProduct,
deleteProduct,
addToWishLst,
rating
};