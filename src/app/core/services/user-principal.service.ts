import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserPrincipalService {

  constructor() {
  }

  getUser(): UserModel | null {
    const nick = "Client";
    const id = "client_id"
    return {id, nick};
  }

}
