export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
  avatar: string;
};

export type RegisterReturnCredentials = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  _id: string;
  __v: number;
};
