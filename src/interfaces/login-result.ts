import { IAuthenticatedUser } from './authenticated-user.interface';

export interface ILoginResult {
  token: string;
  expiresIn: Date | any;
  user: IAuthenticatedUser;
}