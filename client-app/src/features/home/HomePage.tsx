import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

const HomePage = () => {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: '12px' }}
          />
          Wirtualna szafa
        </Header>

        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Witamy w Wirtualnej Szafie' />
            <Button as={Link} to='/clothes' size='huge' inverted>
              Przejdź do swojej Szafy :)
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm stay={false} />)}
              size='huge'
              inverted
            >
              Zaloguj się
            </Button>
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size='huge'
              inverted
            >
              Zarejestruj się
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
};

export default observer(HomePage);
