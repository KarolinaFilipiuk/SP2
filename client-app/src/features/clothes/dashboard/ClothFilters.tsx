import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Form, Header, Menu, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import { useStore } from '../../../app/stores/store';

const ClothFilters = () => {
  const {
    clothStore: { predicate, setPredicate },
  } = useStore();

  const handleFormSubmit = (filters: {
    wardrobe: number | null;
    shelf: number | null;
    category: string | null;
  }) => {
    setPredicate('filters', 'false', filters);
  };
  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: '27px' }}>
        <Header icon='filter' attached color='pink' content='Filters' />
        <Menu.Item
          content='Wszystkie ubrania'
          active={predicate.has('all')}
          onClick={() => setPredicate('all', 'true')}
        />
        <Menu.Item
          content='Pożyczone'
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
        />
        <Menu.Item
          content='Dostępne'
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
        />
        <Segment clearing style={{ border: 'none' }}>
          <Formik
            enableReinitialize
            validationSchema={Yup.object({
              category: Yup.string().notRequired().nullable(true),
              shelf: Yup.number().notRequired().nullable(true),
              wardrobe: Yup.number().notRequired().nullable(true),
            })}
            initialValues={{
              category: predicate.has('filters')
                ? predicate.get('filters').category
                : null,
              shelf: predicate.has('filters')
                ? predicate.get('filters').shelf
                : null,
              wardrobe: predicate.has('filters')
                ? predicate.get('filters').wardrobe
                : null,
            }}
            onSubmit={(values) => handleFormSubmit(values)}
          >
            {({ handleSubmit, dirty, isSubmitting, isValid, resetForm }) => (
              <Form
                className='ui form'
                autoComplete='off'
                onSubmit={handleSubmit}
              >
                <MyTextInput
                  label='Szafa'
                  name='wardrobe'
                  placeholder='Numer szafy'
                  type='number'
                  min={0}
                />

                <MyTextInput
                  label='Półka'
                  name='shelf'
                  placeholder='Numer półki'
                  type='number'
                  min={0}
                />
                <MySelectInput
                  label='Kategoria'
                  name='category'
                  placeholder='Kategoria...'
                  options={categoryOptions}
                />

                <Button
                  floated='left'
                  negative
                  onClick={() => {
                    resetForm();
                  }}
                  content='Wyczyść'
                />
                <Button
                  floated='right'
                  positive
                  type='submit'
                  content='Zatwierdź'
                />
              </Form>
            )}
          </Formik>
        </Segment>
      </Menu>
      <Header />
    </>
  );
};

export default observer(ClothFilters);
