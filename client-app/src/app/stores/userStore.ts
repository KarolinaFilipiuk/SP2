import { history } from './../../index';
import { store } from './store';
import { UserFormValues, IUser } from './../models/user';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';

export default class UserStore {
  user: IUser | null = null;
  passwordChecked: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues, stay: boolean) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      if (!stay) history.push('/clothes');
      if (stay) {
        this.passwordChecked = true;
      }
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.user = null;
    store.clothStore.clothRegister.clear();
    history.push('/');
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push('/clothes');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  setImage = (image: string) => {
    if (this.user) {
      this.user.image = image;
    }
  };

  setDisplayName = async (displayName: string) => {
    if (this.user) {
      this.user.displayName = displayName;
    }
  };
}
