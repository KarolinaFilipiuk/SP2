import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

const RegisterForm = () => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{
        displayName: '',
        username: '',
        email: '',
        password: '',
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className='ui form error'
          onSubmit={handleSubmit}
          autoComplete='off'
        >
          <Header
            as='h2'
            content='Zarejestruj się do Wirtualnej Szafy'
            color='pink'
            textAlign='center'
          />
          <MyTextInput name='displayName' placeholder='Nick' />
          <MyTextInput name='username' placeholder='Nazwa użytkownika' />
          <MyTextInput name='email' placeholder='Email' />
          <MyTextInput name='password' placeholder='Hasło' type='password' />
          <ErrorMessage
            name='error'
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            positive
            type='submit'
            content='Zarejestruj'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(RegisterForm);
