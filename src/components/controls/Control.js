import Input from "./Input";
import Select from "./Select";
import Checkbox from "./Checkbox";
import RadioGroup from "./RadioGroup";
import Button from "./Button";
import Form from "./Form";
import withCustomForm from "../../hooks/useCustomForm";
import { buttonStyle } from "./Button";

const Control = {
  Input: withCustomForm(Input),
  Select: withCustomForm(Select),
  Checkbox: withCustomForm(Checkbox),
  RadioGroup: withCustomForm(RadioGroup),
  Button,
  Form,
  buttonStyle,
};

export default Control;
