const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const validatemongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require("jsonwebtoken");
 

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
        const getUsers = await User.find();
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
logout
};