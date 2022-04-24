import { Controller } from "react-hook-form";

function CustomForm(props) {
  const {
    name,
    control,
    defaultValue = "",
    rules,
    validate,
    Component,
    label,
    value,
    ...rest
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({
        field: { onChange, onBlur, value, name },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <Component
          {...{
            ...rest,
            onChange,
            onBlur,
            error: !!error,
            value,
            label,
            name,
            helperText: error ? error.message : null,
          }}
        />
      )}
    />
  );
}

function withCustomForm(Component) {
  return (props) => {
    props = { ...props, Component };
    return <CustomForm {...props} />;
  };
}

export default withCustomForm;
