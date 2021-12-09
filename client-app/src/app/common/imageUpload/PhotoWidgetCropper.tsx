import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface PhotoWidgetCropperProps {
  setCropper: (cropper: Cropper) => void;
  imagePreview: string;
}

const PhotoWidgetCropper = ({
  setCropper,
  imagePreview,
}: PhotoWidgetCropperProps) => {
  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: '100%' }}
      initialAspectRatio={1} // początkowy stosunek długości obu boków
      aspectRatio={0.75} // końcowy stosunek długości obku boków
      preview='.img-preview'
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={(cropper) => setCropper(cropper)}
    />
  );
};

export default PhotoWidgetCropper;
