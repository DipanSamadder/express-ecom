const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const proCategoryRouter = require("./routes/productCateRoute");
const blogCategoryRouter = require("./routes/blogCateRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const colorRouter = require("./routes/colorRoute");
const uploadRouter = require("./routes/uploadRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHanler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

dbConnect();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/', (req, res) => {
//     res.send("Hello from server side");
// });
console.log("backend routers.");
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/color", colorRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", proCategoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is runing at PORT ${PORT}`);
});
