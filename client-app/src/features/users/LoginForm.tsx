import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
interface LoginFormProps {
  stay: boolean;
}

const LoginForm = ({ stay }: LoginFormProps) => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values, stay)
          .catch((error) => setErrors({ error: 'Invalid email or password' }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <Header
            as='h2'
            content='Logowanie do Wirtualnej Szafy'
            color='pink'
            textAlign='center'
          />
          <MyTextInput name='email' placeholder='Email' />
          <MyTextInput name='password' placeholder='Password' type='password' />
          <ErrorMessage
            name='error'
            render={() => (
              <Label
                style={{ marginBottom: 10 }}
                basic
                color='red'
                content={errors.error}
              />
            )}
          />
          <Button
            loading={isSubmitting}
            positive
            type='submit'
            content='Zaloguj'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(LoginForm);
