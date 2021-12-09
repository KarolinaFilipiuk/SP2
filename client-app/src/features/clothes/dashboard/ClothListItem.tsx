import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Grid,
  Header,
  Image,
  Item,
  Label,
  Segment,
} from 'semantic-ui-react';
import { ICloth } from '../../../app/models/cloth';

interface ClothListItemProps {
  cloth: ICloth;
}

const ClothListItem = ({ cloth }: ClothListItemProps) => {
  return (
    <Segment.Group>
      <Segment>
        {cloth.isCancelled && !cloth.isDeleted && (
          <Label
            attached='top'
            color='red'
            content='Pożyczone'
            style={{ textAlign: 'center' }}
          />
        )}
        {!cloth.isCancelled && !cloth.isDeleted && (
          <Label
            attached='top'
            color='green'
            content='Dostępne'
            style={{ textAlign: 'center' }}
          />
        )}

        {cloth.isDeleted && (
          <Label
            attached='top'
            color='grey'
            content='Przeszło do historii'
            style={{ textAlign: 'center' }}
          />
        )}

        <Grid>
          <Grid.Column width={8}>
            <Image
              style={{ marginBottom: 3 }}
              src={
                cloth.photos.find((photo) => photo.isMain)?.url ||
                `/assets/categoryImages/${cloth.category}.jpg`
              }
            />
          </Grid.Column>

          <Grid.Column width={8}>
            <Grid>
              <Grid.Column width={16} textAlign='center'>
                <Header as={Link} to={`/clothes/${cloth.id}`}>
                  {cloth.title}
                </Header>
              </Grid.Column>
              {!cloth.isCancelled && (
                <>
                  <Grid.Column width={8} textAlign='center'>
                    <Item>
                      <Image
                        className='ui centered image'
                        size='tiny'
                        src={'/assets/wardrobe.png'}
                      />
                      <Label
                        style={{ marginTop: '20px' }}
                        color='blue'
                        circular
                      >
                        {cloth.wardrobe}
                      </Label>
                    </Item>
                  </Grid.Column>

                  <Grid.Column width={8} textAlign='center'>
                    <Item>
                      <Image
                        className='ui centered image'
                        size='tiny'
                        src={'/assets/shelf.png'}
                      />
                      <Label
                        style={{ marginTop: '20px' }}
                        color='blue'
                        circular
                      >
                        {cloth.shelf}
                      </Label>
                    </Item>
                  </Grid.Column>
                </>
              )}

              <Grid.Column
                width={8}
                textAlign='center'
                style={{ marginTop: '10px' }}
              >
                <Header as='h4'>Kategoria</Header>
                <span>{cloth.category}</span>
              </Grid.Column>

              <Grid.Column
                width={8}
                textAlign='center'
                style={{ marginTop: '10px' }}
              >
                <Header as='h4'>Opis</Header>
                <span>{cloth.description}</span>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment clearing>
        <Button
          as={Link}
          to={`/clothes/${cloth.id}`}
          color='blue'
          floated='right'
          content='Szczegóły'
        />
      </Segment>
    </Segment.Group>
  );
};

export default ClothListItem;
