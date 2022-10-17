import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  static readonly KEY_USER_ID = 'USER_ID'
  static readonly KEY_USER_NAME = 'USER_NAME'
  static readonly KEY_TOKEN = 'LOGIN_TOKEN'
  static readonly KEY_USER_ROLE = 'ROLE'
  static readonly KEY_USER_EVENT = 'EVENT'
  static readonly KEY_MANAGE = 'MANAGE'

  userId = '';
  userName = '';

  constructor(
    private dataService: DataService,
  ) {}

  public login(user: any): Promise<any>{
    return this.dataService.postData('m_user/login', {family_name: user.family_name, first_name: user.first_name, password: user.password, manage: user.manage})
    .then(res => {
      if (res.result) {
        // ログイン成功時
        this.getSessionStorage().setItem(LoginService.KEY_USER_ID, res.user_id);
        this.getSessionStorage().setItem(LoginService.KEY_USER_NAME, user.family_name + ' ' + user.first_name);
        this.getSessionStorage().setItem(LoginService.KEY_TOKEN, res.token);
        this.getSessionStorage().setItem(LoginService.KEY_USER_ROLE, res.role);
        this.getSessionStorage().setItem(LoginService.KEY_USER_EVENT, res.event_id);
        this.getSessionStorage().setItem(LoginService.KEY_MANAGE, JSON.stringify(user.manage))
        this.userId = res.user_id;
        return Promise.resolve(res);
      } else {
        // ログイン失敗時
        return Promise.reject(res);
      }
    })
  }

  private getSessionStorage(): Storage {
    return sessionStorage;
  }

  public logout() {
    this.getSessionStorage().clear();
    window.location.reload();
  }

  public getUserId(): string {
    this.userId = this.getSessionStorage().getItem(LoginService.KEY_USER_ID) as string;
    return this.userId
  }

  public getUserName(): string {
    this.userName = this.getSessionStorage().getItem(LoginService.KEY_USER_NAME) as string;
    return this.userName;
  }

  public isAuthenticated(): boolean {
    const token = this.getSessionStorage().getItem(LoginService.KEY_TOKEN);
    return token != null;
  }

  public isFromManage(): boolean {
    return JSON.parse(this.getSessionStorage().getItem(LoginService.KEY_MANAGE) as string);
  }

  public getRoleCd(): string {
    return this.getSessionStorage().getItem(LoginService.KEY_USER_ROLE) as string;
  }

  public isAdminRole(): boolean {
    return this.getRoleCd() === '010101';
  }

  public getEventId(): string {
    return this.getSessionStorage().getItem(LoginService.KEY_USER_EVENT) as string;
  }

}
