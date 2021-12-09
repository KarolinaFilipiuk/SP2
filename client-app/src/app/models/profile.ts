import { IUser } from './user';

export interface Profile {
  username: string;
  displayName: string;
  bio?: string;
  image?: string;
  photos?: Photo[];
}

export class Profile implements Profile {
  constructor(user: IUser) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface UserCloth {
  id: string;
  title: string;
  category: string;
  date: Date;
}
