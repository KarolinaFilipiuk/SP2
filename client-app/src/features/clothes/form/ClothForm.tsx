import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { ClothFormValues } from '../../../app/models/cloth';
import { useStore } from '../../../app/stores/store';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import { v4 as uuid } from 'uuid';

const ClothForm = () => {
  const history = useHistory();
  const { clothStore } = useStore();
  const { createCloth, updateCloth, loadCloth, loadingInitial } = clothStore;
  const { id } = useParams<{ id: string }>();
  const [cloth, setCloth] = useState<ClothFormValues>(new ClothFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required('The cloth title is required'),
    category: Yup.string().required('The cloth category is required'),
    description: Yup.string().required('The cloth description is required'),
    wardrobe: Yup.string().required('The cloth wardrobe is required'),
    shelf: Yup.string().required('The cloth shelf is required'),
  });

  useEffect(() => {
    if (id) {
      loadCloth(id).then((cloth) => {
        setCloth(new ClothFormValues(cloth));
      });
    }
  }, [id, loadCloth]);

  const handleFormSubmit = (cloth: ClothFormValues) => {
    if (!cloth.id) {
      let newCloth = {
        ...cloth,
        id: uuid(),
        date: new Date(),
      };
      createCloth(newCloth).then(() => history.push(`/clothes/${newCloth.id}`));
    } else {
      updateCloth(cloth).then(() => history.push(`/clothes/${cloth.id}`));
    }
  };

  if (loadingInitial) return <LoadingComponent content='Loading cloth...' />;

  return (
    <Segment clearing>
      <Header content='Szczegóły ubrania' sub color='teal' />
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={cloth}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, dirty, isSubmitting, isValid }) => (
          <Form className='ui form' autoComplete='off' onSubmit={handleSubmit}>
            <MyTextInput name='title' placeholder='Nazwa' />
            <MyTextArea placeholder='Opis' name='description' rows={3} />
            <MySelectInput
              placeholder='Kategoria'
              name='category'
              options={categoryOptions}
            />
            <Header content='Szczegóły lokalizacji' sub color='teal' />
            <MyTextInput
              placeholder='Szafa'
              name='wardrobe'
              type='number'
              min={1}
            />
            <MyTextInput
              placeholder='Półka'
              name='shelf'
              type='number'
              min={1}
            />

            <Button
              disabled={!dirty || isSubmitting || !isValid}
              loading={isSubmitting}
              floated='right'
              positive
              type='submit'
              content='Zatwierdź'
            />
            <Button
              as={Link}
              to={'/clothes'}
              floated='right'
              type='button'
              content='Zamknij'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ClothForm);
