import mongoose from "mongoose";
// set rules
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 30,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 65,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {}
);
//create table
const User = mongoose.model("User", userSchema);
//export model
export default User;
