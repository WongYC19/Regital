import { useState, useEffect, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Alert from "./Alert";
import { objectToArray, snakeToCamelObject } from "../../utils/caseConversion";
import { AuthContext } from "../../contexts/AuthContext";
import { styled } from "@mui/system";

const FormContainer = styled("div", { name: "FormContainer", slot: "root" })(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    spacing: 0,
    padding: 0,
    margin: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "none",
  })
);

const ResizedForm = styled("form", { name: "ResizedForm" })(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(4, 8),
  margin: theme.spacing(3, 0),
  boxShadow: `0px 2px 2px 0px ${theme.palette.text.secondary}, 
	0px 3px 1px -2px ${theme.palette.text.secondary}, 
	0px 1px 5px 0px ${theme.palette.text.secondary}`,
  width: "100%",
}));

function Form(props) {
  const { history } = useContext(AuthContext);

  let {
    children,
    defaultValues,
    setDefaultValues,
    onSubmit,
    validator,
    redirectOnSuccess,
    successMessage = "Success.",
    ...other
  } = props;

  const methods = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    ...validator,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const [isSuccess, setIsSuccess] = useState(false);
  const onSuccess = (data, event) => {
    const response = onSubmit(data);
    response
      .then((data) => {
        setIsSuccess(true);
        if (redirectOnSuccess) {
          setTimeout(() => {
            setIsSuccess(false);
            history.push(redirectOnSuccess);
          }, 1000);
        }
      })
      .catch((error) => {
        setIsSuccess(false);
        const errors = error?.response?.data;
        const camelErrors = snakeToCamelObject(errors);
        Object.entries(camelErrors).forEach((error) => {
          const [name, message] = error;
          console.log("Error:", name, message);
          setError(name, { type: "server", message });
        });
      });

    return response;
  };

  const onFailure = (errors, event) => {
    [...Object.entries(errors)].forEach((error) => {
      const [name, message] = error;
      setError(name, message);
    });
  };

  const submitForm = (event) => {
    event.preventDefault();
    return handleSubmit(onSuccess, onFailure)(event);
  };

  useEffect(() => {
    async function updateValue() {
      let newDefaultValues = await setDefaultValues();
      newDefaultValues = snakeToCamelObject(newDefaultValues);
      reset(newDefaultValues);
    }
    if (setDefaultValues !== undefined) updateValue();
    function disappearAlert() {
      setTimeout(() => {
        setIsSuccess(false);
      }, 5 * 1000);
    }
    if (isSuccess) disappearAlert();
    return () => clearTimeout(disappearAlert);
  }, [reset, setDefaultValues, isSuccess]);

  return (
    <FormContainer variant="elevation" elevation={7}>
      {objectToArray(errors, false).length > 0 ? (
        <Alert
          severity="error"
          showDefault={true}
          title="Error"
          message={objectToArray(errors, false).join("\n")}
        />
      ) : null}

      <ResizedForm onSubmit={submitForm} autoComplete="off" {...other}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ResizedForm>

      {isSuccess ? <Alert message={successMessage} showDefault={true} /> : null}
    </FormContainer>
  );
}

export default Form;
