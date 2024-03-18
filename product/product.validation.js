import Yup from "yup";

export const addProductValidationSchema = Yup.object({
  name: Yup.string().required("Name is Required").trim().max(65),
  price: Yup.number()
    .min(0, "Price cannot be a negative number")
    .required("Price is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
});
