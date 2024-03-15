import express from "express";
import connectDB from "./connect.db.js";
import userRouter from "./user/user.route.js";
import User from "./user/user.model.js";

const app = express();

//to make app understand json

app.use(express.json());

//?== database connection
connectDB();

//?====register routes===
app.use(userRouter);

//?server and port allocation

const PORT = 4005;
app.listen(PORT, () => {
  console.log(`Server is at port ${PORT}`);
});
