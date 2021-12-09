import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Button, Card, Header, Image, List, Segment } from 'semantic-ui-react';
import PhotoUploadWidget from '../../../app/common/clothesImageUpload/PhotoUploadWidget';
import { ICloth } from '../../../app/models/cloth';
import { Photo } from '../../../app/models/profile';
import { useStore } from '../../../app/stores/store';

interface ClothDetailedSidebarProps {
  cloth: ICloth;
}

const ClothDetailedSidebar = ({ cloth }: ClothDetailedSidebarProps) => {
  const { clothStore, modalStore } = useStore();

  const [target, setTarget] = useState('');

  const handlePhotoUpload = (file: Blob) => {
    clothStore.uploadPhoto(cloth.id, file);
  };

  const handleSetMainPhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    clothStore.setMainPhoto(cloth.id, photo);
  };

  const handleDeletePhoto = (
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(e.currentTarget.name);
    clothStore.deletePhoto(cloth.id, photo);
  };

  if (!cloth.attendees) return null;
  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        secondary
        inverted
        color='pink'
        fluid
      >
        <Header>Zdjęcia</Header>
      </Segment>

      <Button
        fluid
        color='purple'
        content={'Dodaj zdjęcie'}
        onClick={() =>
          modalStore.openModal(
            <PhotoUploadWidget handlePhotoUpload={handlePhotoUpload} />
          )
        }
      />
      <Segment>
        <List relaxed divided>
          <Card.Group itemsPerRow={2}>
            {cloth.photos.map((photo) => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                <Button.Group fluid widths={2}>
                  <Button
                    name={'main' + photo.id}
                    loading={
                      target === 'main' + photo.id && clothStore.photoUploading
                    }
                    onClick={(e) => handleSetMainPhoto(photo, e)}
                    basic
                    color='green'
                    content='Główne'
                    disabled={photo.isMain}
                  />
                  <Button
                    name={photo.id}
                    loading={target === photo.id && clothStore.photoUploading}
                    onClick={(e) => handleDeletePhoto(photo, e)}
                    basic
                    color='red'
                    icon='trash'
                    disabled={photo.isMain}
                  />
                </Button.Group>
              </Card>
            ))}
          </Card.Group>
        </List>
      </Segment>
    </>
  );
};

export default observer(ClothDetailedSidebar);
