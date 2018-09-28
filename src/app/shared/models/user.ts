export class User {
  id?: string;
  name: string;
  token: string;
  email: string;
  imgPath: string;
  password: string;
  phone: {
    mobile: string;
    work: string;
  }
}
