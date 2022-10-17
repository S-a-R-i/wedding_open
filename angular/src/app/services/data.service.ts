import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static readonly KEY_ROLE_LIST = 'ROLE_LIST';
  static readonly KEY_EVENT_LIST = 'EVENT_LIST';
  private static ROLE_LIST: any = null;
  private static EVENT_LIST: any = null;

  static GET_ROLE_LIST(): any {
    return DataService.ROLE_LIST;
  }

  static GET_EVENT_LIST(): any {
    return DataService.EVENT_LIST;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private commonService: CommonService,
  ){}

  getData(path: string, param: any, showErrorDialog?: boolean): Promise<any> {
    return this.http.get(environment.api_url + path + '/' , {params: param}).toPromise()
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      if (showErrorDialog) {
        this.showErrorDialog(err);
      } else {
        this.errorHandler(err);
      }
    });
  }

  postData(path: string, body: any, showErrorDialog?: boolean): Promise<any> {
    return this.http.post(environment.api_url + path + '/', body).toPromise()
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      if (showErrorDialog) {
        this.showErrorDialog(err);
      } else {
        this.errorHandler(err);
      }
    });
  }

  putData(path: string, body: any, showErrorDialog?: boolean): Promise<any> {
    return this.http.put(environment.api_url + path + '/', body).toPromise()
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      if (showErrorDialog) {
        this.showErrorDialog(err);
      } else {
        this.errorHandler(err);
      }
    });
  }
  deleteData(path: string, param: any, showErrorDialog?: boolean): Promise<any> {
    return this.http.delete(environment.api_url + path + '/', {params: param}).toPromise()
    .then((res) => {
      if (!res) {
        res = 'OK';
      }
      return Promise.resolve(res);
    })
    .catch((err) => {
      if (showErrorDialog) {
        this.showErrorDialog(err);
      } else {
        this.errorHandler(err);
      }
    });
  }


  // エラー制御
  errorHandler(err: any) {
    console.log('Error occured: ', err);
    this.router.navigate(['error'],
      {
        queryParams: {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
        },
        skipLocationChange: true,
      });
  }

  private showErrorDialog(err: any){
    let errorText = '';
    if (err.error) {
      Object.keys(err.error).forEach(key => {
        errorText +=  '\r\n' + err.error[key];
      });
    }
    this.commonService.showErrorDialog('Error: ' + err.statusText + errorText);
  }


    /**
   * マスタ関連
   */
  // 設定マスタからリスト選択肢取得
  public getSystemMaster(_cls_1: string, _cls_2: string): Promise<any> {
    return this.getData('m_system/getListItem', {cls_1: _cls_1, cls_2: _cls_2})
    .then((res) => {
        return res;
    });
  }

  /**
   * sessionStorageへの保存
   */
  private getSessionStorage(): Storage {
    return sessionStorage;
  }

  public setRoleList(list: any) {
    this.getSessionStorage().setItem(DataService.KEY_ROLE_LIST, JSON.stringify(list));
    DataService.ROLE_LIST = list;
  }

  public getRoleList(): any {
    if (!DataService.ROLE_LIST) {
      DataService.ROLE_LIST = JSON.parse(this.getSessionStorage().getItem(DataService.KEY_ROLE_LIST) as string);
    }
    return DataService.ROLE_LIST;
  }

  public setEventList(list: any) {
    this.getSessionStorage().setItem(DataService.KEY_EVENT_LIST, JSON.stringify(list));
    DataService.EVENT_LIST = list;
  }

  public getEventList(): any {
    if (!DataService.EVENT_LIST) {
      DataService.EVENT_LIST = JSON.parse(this.getSessionStorage().getItem(DataService.KEY_EVENT_LIST) as string);
    }
    return DataService.EVENT_LIST;
  }


}
