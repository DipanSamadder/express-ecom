const validatemongoDbId = require("../utils/validateMongodbid");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//createBlog
const createBlog = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
      req.body.metaTitle = req.body.title;
      req.body.metaDes = req.body.title;
    }
    const newBlog = await Blog.create(req.body);
    res.status(200).json({
      status: 200,
      data: newBlog,
      message: "Data added successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      status: 500,
      message: "Sorry! Data isn't added.",
    });
  }
});

//Get a Blog
const getaBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all Blog
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getAllBlog = await Blog.find();
    res.json(getAllBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a Blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const updateblog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateblog);
  } catch (err) {
    throw new Error(err);
  }
});

//Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (err) {
    throw new Error(err);
  }
});

//Likeblog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  console.log(blogId);
  validatemongoDbId(blogId);

  //find the Blog
  const blog = await Blog.findById(blogId);

  //find the login user
  const loginUserId = req?.user?._id;

  //find if user has like the post
  const isLiked = blog?.isLiked;

  //find if user has disliked
  const alreadyDisliked = blog?.dislikes?.find(
    (likedUserId) => likedUserId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

//Dislikeblog
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  validatemongoDbId(blogId);

  //find the Blog
  const blog = await Blog.findById(blogId);

  //find the login user
  const loginUserId = req?.user?._id;

  //find if user has like the post
  const isDisliked = blog?.isDisliked;

  //find if user has liked
  const alreadyLiked = blog?.likes?.find(
    (likedUserId) => likedUserId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  }

  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
module.exports = {
  createBlog,
  getaBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
