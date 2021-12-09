import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { ICloth } from '../../../app/models/cloth';

interface ClothDetailedInfoProps {
  cloth: ICloth;
}
const ClothDetailedInfo = ({ cloth }: ClothDetailedInfoProps) => {
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='pink' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{cloth.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='pink' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{format(cloth.date!, 'dd MMM yyyy h:mm aa')}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='marker' size='large' color='pink' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>
              <strong>Szafa: </strong>
              {cloth.wardrobe},<strong> Półka: </strong> {cloth.shelf}
            </span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='star' size='large' color='pink' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>
              <strong>Kategoria: </strong>
              {cloth.category}
            </span>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ClothDetailedInfo);
