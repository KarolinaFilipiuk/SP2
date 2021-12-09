import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface PhotoWidgetDropzoneProps {
  setFiles: (files: any) => void;
}

const PhotoWidgetDropzone = ({ setFiles }: PhotoWidgetDropzoneProps) => {
  const dzStyles = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: 200,
  };

  const dzActiveStyles = {
    borderColor: 'green',
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActiveStyles } : dzStyles}
    >
      <input {...getInputProps()} />
      <Icon name='upload' size='huge' />
      <Header content='Przeciągnij zdjęcie tutaj' />
    </div>
  );
};

export default PhotoWidgetDropzone;
