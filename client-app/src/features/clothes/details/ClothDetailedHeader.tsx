import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Item, Label, Segment } from 'semantic-ui-react';
import { ICloth } from '../../../app/models/cloth';
import { useStore } from '../../../app/stores/store';

const clothImageStyle = {
  filter: 'brightness(70%)',
};

const clothImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};
interface ClothDetailedHeaderProps {
  cloth: ICloth;
}

const ClothDetailedHeader = ({ cloth }: ClothDetailedHeaderProps) => {
  const {
    clothStore: { cancelClothToggle, deleteClothToggle, loading },
  } = useStore();
  const [target, setTarget] = useState('');

  const handleDeleteCloth = (e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    deleteClothToggle();
  };
  const handleCancelCloth = (e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    cancelClothToggle();
  };

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        {cloth.isCancelled && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color='red'
            content='Pożyczone'
          />
        )}
        {cloth.isDeleted && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color='grey'
            content='Przeszło do historii'
          />
        )}
        <Image
          src={
            cloth.photos.find((photo) => photo.isMain)?.url ||
            `/assets/categoryImages/${cloth.category}.jpg`
          }
          fluid
          style={clothImageStyle}
        />
        <Segment style={clothImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={cloth.title}
                  style={{ color: 'white' }}
                />
                <p>{format(cloth.date!, 'dd MMM yyyy')}</p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        <>
          <Button
            onClick={handleCancelCloth}
            color={cloth.isCancelled ? 'green' : 'red'}
            floated='left'
            basic
            content={cloth.isCancelled ? 'Zwróć' : 'Pożycz'}
            disabled={cloth.isDeleted}
            name={cloth.id}
            loading={target === cloth.id && loading}
          />
          <Button
            onClick={handleDeleteCloth}
            color={cloth.isDeleted ? 'blue' : 'grey'}
            floated='left'
            content={cloth.isDeleted ? 'Przywróć' : 'Usuń'}
            name={'main' + cloth.id}
            loading={target === 'main' + cloth.id && loading}
          />
          <Button
            as={Link}
            to={`/manage/${cloth.id}`}
            color='orange'
            floated='right'
            disabled={cloth.isCancelled || cloth.isDeleted}
          >
            Edytuj
          </Button>
        </>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ClothDetailedHeader);
