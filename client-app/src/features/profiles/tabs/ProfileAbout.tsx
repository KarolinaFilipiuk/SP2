import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ProfileEditForm from '../ProfileEditForm';

const ProfileAbout = () => {
  const {
    profileStore: { isCurrentUser, profile },
  } = useStore();

  const [editMode, setEditMode] = useState(false);
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`Kilka słów o użytkowniku: ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={editMode ? 'Zamknij' : 'Edytuj profil'}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
