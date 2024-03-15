import Yup from "yup";
const addUserValidationSchema = Yup.object({
  firstName: Yup.string()
    .required()
    .trim()
    .max(30, "First Name must be at max 30 characters"),
  lastName: Yup.string()
    .required()
    .trim()
    .max(30, "Last Name must be at max 30 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .max(65, "Email must be at max 65 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .max(30, "Password must be at max 30 characters"),
});

export default addUserValidationSchema;
