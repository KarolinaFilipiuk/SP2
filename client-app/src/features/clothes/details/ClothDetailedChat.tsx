import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  clothId: string;
}

export default observer(function ClothDetailedChat({ clothId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (clothId) {
      commentStore.createHubConnection(clothId);
    }
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, clothId]);

  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='pink'
        style={{ border: 'none' }}
      >
        <Header>Notatki</Header>
      </Segment>

      <Segment attached clearing>
        <Formik
          onSubmit={(values, { resetForm }) =>
            commentStore.addComment(values).then(() => resetForm())
          }
          initialValues={{ body: '' }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className='ui form'>
              <Field name='body'>
                {(props: FieldProps) => (
                  <div style={{ position: 'relative' }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      rows={3}
                      placeholder='Wpisz treść notatki 
                       - Naciśnij Enter aby zatwierdzić
                       - SHIFT + enter doda nową linię'
                      {...props.field}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          return;
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault(); // nie będzie nowej linii
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>

        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || '/assets/user.png'} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
});
