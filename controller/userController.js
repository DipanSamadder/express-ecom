const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asyncHandler = require("express-async-handler");
const uniqid = require("uniqid");

const validatemongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require("jsonwebtoken");
const { sendEmail } = require('./emailController');
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error("User Already Exists");
    }
});

const loginUrlCtrl = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;
    //chekc if user exists or not

    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refressToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser?._id,
            {
                refreshToken: refressToken
            },
            {
                new:true
            }
        );
        res.cookie('refreshToken', refressToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,  
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error("Invalid Credentials");
    }
});

//Update a user

const updatedUser = asyncHandler(async (req, res) => {
    const {id} = req.user;
    validatemongoDbId(id);
    try{
        const updateduser = await User.findByIdAndUpdate(
            id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
               new: true 
            }
            );
            res.json({
                updateduser
            });
    }catch (error){
        throw new Error(error);
    }
});



//Get All User

const getallUser = asyncHandler( async (req,res) => {
    try{
 
        //Filtering
        const queryObj = {...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
        let query = User.find(JSON.parse(queryStr));

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
            const userCount = await User.countDocuments();
            if(skip >= userCount) throw new Error("This page does not exists.");
        }
        
        query = query.skip(skip).limit(limit);

        const getUsers = await query;


        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

//Get a single User

const getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const getaUser = await User.findById(id);
        res.json({
            getaUser
        });
    }catch(error){
        throw new Error(error);
    }
});

//Delete a single User 

const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser
        });
    }catch(error){
        throw new Error(error);
    }
});

//block user

const blockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new:true,
            }
        );
        res.json({
            message: "User blocked",
            block,
        });
    }catch(error){
        throw new Error(error);
    }
});


//Unblock user

const unblockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validatemongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new:true,
            }
        );
        res.json({
            message: "User Unblock",
            unblock
        });
    }catch(error){
        throw new Error(error);
    }
});

// handle refresh token

const handleRefreshtoken = asyncHandler( async (req, res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
         if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token.");
         }
         const accessToken =  generateToken(user?._id);
         res.json({ accessToken });
    });
    res.json({user});
});


//Logout

const logout = asyncHandler( async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true
        });
         res.sendStatus(204); //forbidden
        await User.findOneAndUpdate(refreshToken, {
            refreshToken:"",
        });
    } 
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true
    });
     res.sendStatus(204); //forbidden
});

//UpdatePassword
const updatePassword = asyncHandler(async (req,res) => {
    const { _id }  = req.user;
    const { password } = req.body;
    validatemongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatepass = await user.save();
        res.json(updatepass);
    }else{
        res.json(user);
    }
});

//forgotPasswordToke
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found with this email");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now.<a href='http:://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to:process.env.MAIL_FROM,
            subject: "Forgot Password Link",
            text: "Hey User",
            html: resetURL,
        }
        sendEmail(data);
        res.json({"token":token});
        
    }catch(err){
        throw new Error(err); 
    }
 });

//resetPassword
 const resetPassword = asyncHandler(async (req, res) =>{
    const { password } = req.body;
    const { token } = req.params;
    console.log(token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
   
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    
    if(!user) throw new Error("Token Expired, Please try again later.");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires - undefined;

    console.log(password);
    await user.save();
    res.json(user);
 });

 //adminlogin 
 const loginAdmin = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    //check if user exists or not 
    const findAdmin = await User.findOne({ email });
    if(!findAdmin){
        throw new Error("Not found.");
    }
    if(findAdmin.role !== 'admin') throw new Error("Not Authorised.");

    if(findAdmin && (await findAdmin.isPasswordMatched(password))){

        const refreshToken = await generateRefreshToken(findAdmin?._id);

        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 100,
        });
    
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });

    }else{
        throw new Error("Invalid Credentials.");
    }

 });


//getWishlist
 const getWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try{

        const findUser = await User.findById(id);
        res.json(findUser);

    }catch(error){
        throw new Error(error);
    }
 });

//SaveAddress = asyncHandler();
const SaveAddress = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    validatemongoDbId(id);
    try{

        const updateUser = await User.findByIdAndUpdate(
            id,
            { 
                address: req?.body?.address
            },
            {
                new:true
            }
        );

        res.json(updateUser);

    }catch(error){
        throw new Error(error);
    }
});

//UserCart 
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;

    validatemongoDbId(_id);

    try{
        let products = [];
        const user = await User.findById(_id);

        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({
            orderby: user._id
        });

        if(alreadyExistCart){
            alreadyExistCart:remove();
        }

        for(let i = 0; i < cart.length; i++ ){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }

        let cartTotal = 0; 
        for (let i=0; i < products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        
        let newCart = await new Cart({
            products, 
            cartTotal, 
            totalAfterDiscount:0,
            orderBy:user?._id,
        }).save();

        res.json({ newCart });

    }catch(error){
        throw new Error(error);
    }

});

//GetUserCart
const getUserCart = asyncHandler(async (req, res)=> {
    const { _id } = req.user;
    validatemongoDbId(_id);
    try{
        const cart = await Cart.findOne({ orderBy: _id }).populate("products.product"); 
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});


//emptyCart
const emptyCart = asyncHandler(async (req, res)=> {
    const { _id } = req.user;
    try{

        console.log(_id);
        const cart = await Cart.findOneAndDelete({orderBy: _id}); 
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});

//apply coupon
const applyCoupon = asyncHandler(async (req, res)=>{
    const { coupon } = req.body;
    const { _id } = req.user;
    const validCoupon = await Coupon.findOne({ name: coupon });
    
    if(validCoupon === null){
        throw new Error("Invalid Coupon.");
    }
    const user = await User.findOne({ _id });

    let { cartTotal }  = await Cart.findOne({ orderBy: user._id }).populate("products.product");

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100 ).toFixed(2);

    await Cart.findOneAndUpdate({ orderBy:user._id }, { totalAfterDiscount }, { new: true });

    res.json({ totalAfterDiscount });
    
});

//CreateOrder
const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validatemongoDbId(_id);
    try{
        if(!COD) throw new Error("Create cash order Failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderBy: user._id });
        let finalAmount = 0;

        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount
        }else{
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({

            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery", 
                created: Date.now(),
                currency: "usd",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delivery",

        }).save();

        let update = userCart.products.map((item) =>{
            return {
                updateOne:{
                    filter: { _id: item.product._id },
                    update: {$inc: { quantity: -item.count, solid: +item.count}}
                }
            }
        });

        const updated = await Product.bulkWrite(update, {});
        res.json({ message: "success" });

    }catch(error){
        throw new Error(error);
    }
    if(!COD) throw new Error("Create cash order failed.");

});

//getOrders
const getOrders = asyncHandler(async (req, res)=>{

    const { _id } = req.user;

    validatemongoDbId(_id);
    try{
        const userOrders = await Order.findOne({ orderBy: _id }).populate('products.product').exec();
        res.json(userOrders);
    }catch(error){
        throw new Error(error);
    }
});

//updateOrderStatus
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validatemongoDbId(id);
   try{
        const findOrder = await Order.findByIdAndUpdate(
            id,
            {
            orderStatus: status,
            paymentIntent: {
                status: status,
            },
        },
        {
            new: true
        });
        res.json(findOrder);
   }catch(error){
        throw new Error(error);
   }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const alluserorders = await Order.find()
        .populate("products.product")
        .populate("orderBy")
        .exec();
      res.json(alluserorders);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { 
createUser,
loginUrlCtrl,
getallUser,
getaUser,
deleteaUser,
updatedUser,
blockUser,
unblockUser,
handleRefreshtoken,
logout,
updatePassword,
forgotPasswordToken,
resetPassword,
loginAdmin,
getWishlist,
SaveAddress,
userCart,
getUserCart,
emptyCart,
applyCoupon,
createOrder,
getOrders,
updateOrderStatus,
getAllOrders
};