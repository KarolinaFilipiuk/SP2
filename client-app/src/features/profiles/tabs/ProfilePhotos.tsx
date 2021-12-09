import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import { Photo, Profile } from '../../../app/models/profile';
import { useStore } from '../../../app/stores/store';
import PhotoUploadWidget from '../../../app/common/imageUpload/PhotoUploadWidget';

interface ProfilePhotosProps {
  profile: Profile;
}

const ProfilePhotos = ({ profile }: ProfilePhotosProps) => {
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      uploading,
      loading,
      setMainPhoto,
      deletePhoto,
    },
  } = useStore();

  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const [target, setTarget] = useState('');

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='image' content='Zdjęcia' />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              content={addPhotoMode ? 'Zamknij' : 'Dodaj zdjęcie'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploading={uploading}
              handlePhotoUpload={handlePhotoUpload}
            />
          ) : (
            <Card.Group itemsPerRow={4}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        name={'main' + photo.id}
                        loading={target === 'main' + photo.id && loading}
                        onClick={(e) => handleSetMainPhoto(photo, e)}
                        basic
                        color='green'
                        content='Główne'
                        disabled={photo.isMain}
                      />
                      <Button
                        name={photo.id}
                        loading={target === photo.id && loading}
                        onClick={(e) => handleDeletePhoto(photo, e)}
                        basic
                        color='red'
                        icon='trash'
                        disabled={photo.isMain}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
