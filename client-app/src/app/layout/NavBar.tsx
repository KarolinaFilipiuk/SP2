import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

const NavBar = () => {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} exact to='/' header>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Wirtualna Szafa
        </Menu.Item>
        <Menu.Item as={NavLink} to='/clothes' name='Ubrania' />
        <Menu.Item>
          <Button
            as={NavLink}
            to='/createCloth'
            color='purple'
            content='Dodaj ubranie'
          />
        </Menu.Item>
        <Menu.Item position='right'>
          <Image
            src={user?.image || '/assets/user.png'}
            avatar
            spaced='right'
          />
          <Dropdown pointing='top right' text={user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`/profiles/${user?.username}`}
                content='Mój profil'
                icon='user'
              />
              <Dropdown.Item onClick={logout} content='Wyloguj' icon='power' />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
