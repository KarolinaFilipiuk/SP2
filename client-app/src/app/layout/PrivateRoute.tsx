import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { useStore } from '../stores/store';

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const {
    userStore: { isLoggedIn },
  } = useStore();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

export default PrivateRoute;
