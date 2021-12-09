import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ClothListItem from './ClothListItem';

const ClothList = () => {
  const { clothStore } = useStore();
  const { groupedClothes } = clothStore;

  return (
    <>
      {groupedClothes.length === 0 && (
        <Segment placeholder>
          <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Lub</Divider>

            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <Header icon>
                  <Icon name='search' />
                  Zmień ustawienia filtrów
                </Header>
              </Grid.Column>

              <Grid.Column>
                <Header icon>
                  <Icon name='world' />
                  Dodaj nowe ubranie
                </Header>
                <Button as={NavLink} to='/createCloth' color='purple'>
                  Dodaj ubranie
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}
      {groupedClothes.map(([group, clothes]) => (
        <Fragment key={group}>
          <Header sub color='pink'>
            {group}
          </Header>
          {clothes.map((cloth) => (
            <ClothListItem key={cloth.id} cloth={cloth} />
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default observer(ClothList);
