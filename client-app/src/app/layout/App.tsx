import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import ClothDashboard from '../../features/clothes/dashboard/ClothDashboard';
import ClothDetails from '../../features/clothes/details/ClothDetails';
import ClothForm from '../../features/clothes/form/ClothForm';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import TestError from '../../features/errors/TestError';
import HomePage from '../../features/home/HomePage';
import ProfilePage from '../../features/profiles/ProfilePage';
import ModalContainer from '../common/modals/ModalContainer';
import NavBar from '../layout/NavBar';
import PrivateRoute from '../layout/PrivateRoute';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';

const App = () => {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) {
    return <LoadingComponent content='Loading app...' />;
  }

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />

      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute
                  exact
                  path='/clothes'
                  component={ClothDashboard}
                />
                <PrivateRoute path='/clothes/:id' component={ClothDetails} />
                <PrivateRoute
                  key={location.key}
                  path={['/createCloth', '/manage/:id']}
                  component={ClothForm}
                />
                <PrivateRoute
                  path='/profiles/:username'
                  component={ProfilePage}
                />
                <PrivateRoute path='/errors' component={TestError} />
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default observer(App);
