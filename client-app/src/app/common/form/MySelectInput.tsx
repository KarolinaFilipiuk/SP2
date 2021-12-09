import React from 'react';
import { useField } from 'formik';
import { Form, Label, Select } from 'semantic-ui-react';

interface MySelectInputProps {
  placeholder: string;
  name: string;
  options: any;
  label?: string;
}

const MySelectInput = (props: MySelectInputProps) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        value={field.value || null}
        placeholder={props.placeholder}
        onBlur={() => helpers.setTouched(true)}
        onChange={(e, d) => helpers.setValue(d.value)}
        options={props.options}
      />
      {meta.touched && meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};

export default MySelectInput;
