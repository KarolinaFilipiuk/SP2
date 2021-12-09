import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ClothDetailedChat from './ClothDetailedChat';
import ClothDetailedHeader from './ClothDetailedHeader';
import ClothDetailedInfo from './ClothDetailedInfo';
import ClothDetailedSidebar from './ClothDetailedSidebar';

export default observer(function ClothDetails() {
  const { clothStore } = useStore();
  const {
    selectedCloth: cloth,
    loadCloth,
    loadingInitial,
    clearSelectedCloth,
  } = clothStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadCloth(id);
    return () => clearSelectedCloth();
  }, [id, loadCloth, clearSelectedCloth]);

  if (loadingInitial || !cloth)
    return <LoadingComponent content='Loading...' />;

  return (
    <Grid>
      <Grid.Column width={8}>
        <ClothDetailedHeader cloth={cloth} />
        <ClothDetailedInfo cloth={cloth} />
        <ClothDetailedChat clothId={cloth.id} />
      </Grid.Column>
      <Grid.Column width={8}>
        <ClothDetailedSidebar cloth={cloth} />
      </Grid.Column>
    </Grid>
  );
});
