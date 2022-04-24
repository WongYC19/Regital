import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const passwordRule = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

const emailRule = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
const phoneNumberRule = new RegExp(
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
);

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name required."),
  lastName: Yup.string().required("Last name required."),
  gender: Yup.string().required("Gender required."),

  email: Yup.string()
    .required("Email required.")
    .matches(emailRule, "Please enter a valid email address."),

  phoneNumber: Yup.string().matches(
    phoneNumberRule,
    "Please enter a valid phone number."
  ),
});

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email required.")
    .matches(emailRule, "Please enter a valid email address."),

  password: Yup.string()
    .required("Password required")
    .min(8, "Password length should be at least 8 characters")
    .matches(
      passwordRule,
      "Password must contains numbers, upper and lower case characters, and symbols."
    ),
});

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email required.")
    .matches(emailRule, "Please enter a valid email address."),

  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password length should be at least 8 characters")
    .matches(
      passwordRule,
      "Password must contains numbers, upper and lower case characters, and symbols."
    ),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must and should match"),

  firstName: Yup.string().required("First name required."),
  lastName: Yup.string().required("Last name required."),
});

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Password is required.")
    .min(8, "Password length should be at least 8 characters")
    .matches(
      passwordRule,
      "Password must contains numbers, upper and lower case characters, and symbols."
    ),

  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be at least 8 characters")
    .matches(
      passwordRule,
      "Password must contains numbers, upper and lower case characters, and symbols."
    ),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must and should match"),
});

const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email required")
    .matches(emailRule, "Please enter a valid email address."),
});

const resetPasswordConfirmSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be at least 8 characters")
    .matches(
      passwordRule,
      "Password must contains numbers, upper and lower case characters, and symbols."
    ),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must and should match"),
});

export const loginValidator = { resolver: yupResolver(loginSchema) };

export const registerValidator = {
  resolver: yupResolver(registerSchema),
};

export const profileValidator = { resolver: yupResolver(profileSchema) };

export const changePasswordValidator = {
  resolver: yupResolver(changePasswordSchema),
};

export const resetPasswordValidator = {
  resolver: yupResolver(resetPasswordSchema),
};

export const resetPasswordConfirmValidator = {
  resolver: yupResolver(resetPasswordConfirmSchema),
};
