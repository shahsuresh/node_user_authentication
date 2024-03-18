import express from "express";
import connectDB from "./connect.db.js";
import userRouter from "./user/user.route.js";
import productRouter from "./product/product.route.js";

const app = express();

//to make app understand json

app.use(express.json());

//?== database connection
connectDB();

//?====register routes===
app.use(userRouter);
app.use(productRouter);

//?server and port allocation

const PORT = 4005;
app.listen(PORT, () => {
  console.log(`Server is at port ${PORT}`);
});
