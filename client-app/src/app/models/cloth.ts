import { Photo, Profile } from './profile';
export interface ICloth {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  wardrobe: string;
  shelf: string;
  hostUsername: string;
  isCancelled: boolean;
  isDeleted: boolean;
  isGoing: boolean; // czy zalogowany użytkownik jest zapisany do aktywności
  isHost: boolean; // czy zalogowany użytkownik jest hostem aktywności
  host?: Profile; // profil hosta aktywności
  attendees: Profile[];
  photos: Photo[];
}

export class ICloth implements ICloth {
  constructor(init?: ClothFormValues) {
    Object.assign(this, init);
  }
}
export class ClothFormValues {
  id?: string = undefined;
  title: string = '';
  date: Date | null = null;
  description: string = '';
  category: string = '';
  wardrobe: string = '';
  shelf: string = '';

  constructor(cloth?: ClothFormValues) {
    if (cloth) {
      this.id = cloth.id;
      this.title = cloth.title;
      this.date = cloth.date;
      this.description = cloth.description;
      this.category = cloth.category;
      this.wardrobe = cloth.wardrobe;
      this.shelf = cloth.shelf;
    }
  }
}
