import React from 'react';
import { Message } from 'semantic-ui-react';

interface ValidationErrorsProps {
  errors: any;
}

const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: any, id: any) => (
            <Message.Item key={id}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
};

export default ValidationErrors;
