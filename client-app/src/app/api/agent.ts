import { PaginatedResult } from './../models/pagination';
import { Profile, Photo, UserCloth } from './../models/profile';
import { IUser, UserFormValues } from './../models/user';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { ClothFormValues, ICloth } from '../models/cloth';
import { store } from '../stores/store';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === 'development') {
      await sleep(1000);
    }

    const pagination = response.headers['pagination'];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === 'string') {
          toast.error(data);
        }
        if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
          history.push('/not-found');
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error('unauthorised');
        break;
      case 403:
        toast.error('unauthorised');
        break;
      case 404:
        history.push('/not-found');
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push('/server-error');
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Clothes = {
  list: (params: URLSearchParams) =>
    axios
      .get<PaginatedResult<ICloth[]>>('/clothes', { params: params })
      .then(responseBody),
  details: (id: string) => request.get<ICloth>(`/clothes/${id}`),
  create: (cloth: ClothFormValues) => request.post<void>('/clothes', cloth),
  update: (cloth: ClothFormValues) =>
    request.put<void>(`/clothes/${cloth.id}`, cloth),
  delete: (id: string) => request.del<void>(`/clothes/${id}`),
  attend: (id: string) => request.post<void>(`/clothes/${id}/attend`, {}),
  deleteToggle: (id: string) =>
    request.post<void>(`/clothes/${id}/deleteToggle`, {}),
  uploadPhoto: (id: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>(`photos/${id}`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
  },
  setMainPhoto: (clothId: string, id: string) =>
    request.post(`/photos/setMain/${clothId}/${id}`, {}),
  deletePhoto: (clothId: string, id: string) =>
    request.del(`/photos/${clothId}/${id}`),
};

const Account = {
  current: () => request.get<IUser>('/account'),
  login: (user: UserFormValues) => request.post<IUser>('/account/login', user),
  register: (user: UserFormValues) =>
    request.post<IUser>('/account/register', user),
};

const Profiles = {
  get: (username: string) => request.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    });
  },
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.del(`/photos/${id}`),
  edit: (profile: Partial<Profile>) => request.put<void>(`/profiles`, profile),
  listClothes: (username: string, predicate: string) =>
    request.get<UserCloth[]>(
      `/profiles/${username}/clothes?predicate=${predicate}`
    ),
};

const agent = { Clothes, Account, Profiles };

export default agent;
