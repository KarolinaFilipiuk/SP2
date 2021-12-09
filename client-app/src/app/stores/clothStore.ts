import { Pagination, PagingParams } from '../models/pagination';
import { Photo, Profile } from '../models/profile';
import { ICloth, ClothFormValues } from '../models/cloth';
import { makeAutoObservable, runInAction, reaction } from 'mobx';
import agent from '../api/agent';
import { format } from 'date-fns';
import { store } from './store';

export default class ClothStore {
  clothRegister = new Map<string, ICloth>();
  selectedCloth: ICloth | undefined = undefined;
  editMode: boolean = false;
  loadingInitial: boolean = false;
  loading: boolean = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set('all', true);
  photoUploading: boolean = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(), // jeżeli klucze się zmienią
      () => {
        this.pagingParams = new PagingParams(); // bo chemy mieć paginację od 0
        this.clothRegister.clear();
        this.loadClothes(); // w tej funkcji będą ustawione parametry axios
      }
    );
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (
    predicate: string,
    value: string | Date,
    filters?: {
      wardrobe: number | null;
      shelf: number | null;
      category: string | null;
    }
  ) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== 'startDate' && key !== 'filters')
          this.predicate.delete(key);
      });
    };
    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;
      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing', true);
        break;
      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost', true);
        break;
      case 'startDate':
        this.predicate.delete('startDate');
        this.predicate.set('startDate', value);
        break;
      case 'filters':
        this.predicate.delete('filters');
        this.predicate.set('filters', filters);
    }
  };

  get axiosParams() {
    const params = new URLSearchParams(); // to nie wymaga importu!
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      }
      if (key === 'filters') {
        value.wardrobe && params.append('wardrobe', value.wardrobe);
        value.shelf && params.append('shelf', value.shelf);
        value.category && params.append('category', value.category);
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  get clothesByDate() {
    return Array.from(this.clothRegister.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedClothes() {
    return Object.entries(
      this.clothesByDate.reduce((clothes, cloth) => {
        const date = format(cloth.date!, 'dd MMM yyyy');
        clothes[date] = clothes[date] ? [...clothes[date], cloth] : [cloth];
        return clothes;
      }, {} as { [key: string]: ICloth[] })
    );
  }

  loadClothes = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Clothes.list(this.axiosParams);

      result.data.forEach((cloth) => {
        this.setCloth(cloth);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadCloth = async (id: string) => {
    let cloth = this.getCloth(id);
    if (cloth) {
      this.selectedCloth = cloth;
      return cloth;
    } else {
      this.setLoadingInitial(true);
      try {
        cloth = await agent.Clothes.details(id);
        this.setCloth(cloth);
        runInAction(() => {
          this.selectedCloth = cloth;
        });
        this.setLoadingInitial(false);
        return cloth;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private getCloth = (id: string) => {
    return this.clothRegister.get(id);
  };

  private setCloth = (cloth: ICloth) => {
    const user = store.userStore.user;

    if (user) {
      cloth.isGoing = cloth.attendees!.some(
        (a) => a.username === user.username
      );
      cloth.isHost = cloth.hostUsername === user.username;
      cloth.host = cloth.attendees?.find(
        (a) => a.username === cloth.hostUsername
      );
    }

    cloth.date = new Date(cloth.date!);
    this.clothRegister.set(cloth.id, cloth);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createCloth = async (cloth: ClothFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Clothes.create(cloth);
      const newCloth = new ICloth(cloth);
      newCloth.hostUsername = user!.username;
      newCloth.attendees = [attendee];
      newCloth.photos = [];
      this.setCloth(newCloth);
      runInAction(() => {
        this.selectedCloth = newCloth;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
  };

  updateCloth = async (cloth: ClothFormValues) => {
    try {
      await agent.Clothes.update(cloth);
      runInAction(() => {
        if (cloth.id) {
          let updatedCloth = {
            ...this.getCloth(cloth.id),
            ...cloth,
          };
          this.clothRegister.set(cloth.id, updatedCloth as ICloth);
          this.selectedCloth = updatedCloth as ICloth;
        }
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
  };

  deleteCloth = async (id: string) => {
    console.log(id);
    this.loading = true;
    try {
      await agent.Clothes.delete(id);
      runInAction(() => {
        this.clothRegister.delete(id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loading = false;
      });
    }
  };

  cancelClothToggle = async () => {
    this.loading = true;

    try {
      await agent.Clothes.attend(this.selectedCloth!.id);
      runInAction(() => {
        this.selectedCloth!.isCancelled = !this.selectedCloth?.isCancelled;
        this.clothRegister.set(this.selectedCloth!.id, this.selectedCloth!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deleteClothToggle = async () => {
    this.loading = true;

    try {
      await agent.Clothes.deleteToggle(this.selectedCloth!.id);
      runInAction(() => {
        this.selectedCloth!.isDeleted = !this.selectedCloth?.isDeleted;
        this.clothRegister.set(this.selectedCloth!.id, this.selectedCloth!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  clearSelectedCloth = () => {
    this.selectedCloth = undefined;
  };

  uploadPhoto = async (clothId: string, file: Blob) => {
    this.photoUploading = true;
    try {
      const response = await agent.Clothes.uploadPhoto(clothId, file);
      const photo = response.data;
      runInAction(() => {
        if (this.selectedCloth) {
          this.selectedCloth.photos.push(photo);
          store.modalStore.closeModal();
        }
        this.photoUploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.photoUploading = false;
      });
    }
  };

  setMainPhoto = async (clothId: string, photo: Photo) => {
    this.photoUploading = true;
    try {
      await agent.Clothes.setMainPhoto(clothId, photo.id);
      runInAction(() => {
        if (this.selectedCloth && this.selectedCloth.photos) {
          this.selectedCloth.photos.find((p) => p.isMain)!.isMain = false;
          this.selectedCloth.photos.find((p) => p.id === photo.id)!.isMain =
            true;
          this.photoUploading = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.photoUploading = false;
      });
    }
  };

  deletePhoto = async (clothId: string, photo: Photo) => {
    this.photoUploading = true;
    try {
      await agent.Clothes.deletePhoto(clothId, photo.id);
      runInAction(() => {
        if (this.selectedCloth) {
          this.selectedCloth.photos = this.selectedCloth.photos.filter(
            (p) => p.id !== photo.id
          );
          this.photoUploading = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.photoUploading = false;
      });
    }
  };
}
