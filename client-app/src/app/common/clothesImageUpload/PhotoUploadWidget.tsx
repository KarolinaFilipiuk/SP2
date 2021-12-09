import React, { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';

interface PhotoUploadWidgetProps {
  handlePhotoUpload: (file: Blob) => void;
}

const PhotoUploadWidget = ({ handlePhotoUpload }: PhotoUploadWidgetProps) => {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();
  const {
    modalStore,
    clothStore: { photoUploading },
  } = useStore();

  const onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => handlePhotoUpload(blob!));
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color='pink' content='DODAJ ZDJĘCIE' />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color='pink' content='WYKADRUJ' />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color='pink' content='SPRAWDŹ & DODAJ' />
        {files && files.length > 0 && (
          <div
            className='img-preview'
            style={{ minHeight: 200, overflow: 'hidden' }}
          />
        )}
      </Grid.Column>
      <Grid.Column width={16}>
        {files && files.length > 0 ? (
          <>
            <Button.Group widths={2}>
              <Button
                onClick={onCrop}
                positive
                icon='check'
                loading={photoUploading}
              />
              <Button
                onClick={() => {
                  setFiles([]);
                  modalStore.closeModal();
                }}
                icon='close'
                disabled={photoUploading}
              />
            </Button.Group>
          </>
        ) : (
          <Button
            onClick={() => {
              modalStore.closeModal();
            }}
            icon='close'
            fluid
            content='Zamknij'
            disabled={photoUploading}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(PhotoUploadWidget);
