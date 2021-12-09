import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ClothList from './ClothList';
import ClothFilters from './ClothFilters';
import ClothListItemPlaceholder from './ClothListItemPlaceholder';

const ClothDashboard = () => {
  const { clothStore } = useStore();
  const {
    loadClothes,
    loadingInitial,
    clothRegister,
    setPagingParams,
    pagination,
  } = clothStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadClothes().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    if (clothRegister.size <= 1) loadClothes();
  }, [clothRegister.size, loadClothes]);

  return (
    <Grid>
      <Grid.Column width='10'>
        {loadingInitial && !loadingNext ? (
          <>
            <ClothListItemPlaceholder />
            <ClothListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
            initialLoad={false}
          >
            <ClothList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width='6'>
        <ClothFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ClothDashboard);
