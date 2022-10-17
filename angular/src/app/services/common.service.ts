import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { Sort } from '@angular/material/sort';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private location: Location,
  ) {}

  diffDay = 0;

  /**
   * ダイアログ関連
   */
  showInfoDialog(message: string, callback?: any) {
    const dialog = this.matDialog.open(MessageComponent, {
      data : {type: 'alert', level: 'info', text: message},
      disableClose : false
    });
    dialog.afterClosed().subscribe(() => {
      if (callback) {
      callback();
      }
    });
  }
  showErrorDialog(message: string, callback?: any) {
    const dialog = this.matDialog.open(MessageComponent, {
                data : {type: 'alert', level: 'error', text: message},
                disableClose : false
                });
    dialog.afterClosed().subscribe(() => {
      if (callback) {
        callback();
      }
    });
  }
  showConfirmDialog(message: string, callback: any, sizeName?: string) {
    const dialog = this.matDialog.open(MessageComponent, {
                data : {type: 'confirm', level: 'warn', size: sizeName, text: message},
                disableClose : false
                });
    dialog.afterClosed().subscribe( (result: any) => {
      if (callback) {
        callback(result === 'OK');
      }
    });
  }
  showConfirmDialogPromise(message: string): Promise<any> {
    const dialog = this.matDialog.open(MessageComponent, {
                data : {type: 'confirm', level: 'warn', text: message},
                disableClose : false
                });
    return dialog.afterClosed().toPromise()
    .then((res) => {
      return Promise.resolve(res === 'OK');
    });
  }

  // ソート
  public sortData(sort: Sort, dataList: any): any {
    const tempList = dataList.slice();
    if (sort) {
      tempList.sort((a: any, b: any) => {
        const isAsc = sort.direction === 'asc';
        return this.compare(a[sort.active], b[sort.active], isAsc);
      });
    }
    return tempList;
  }
  private compare(a: number | string, b: number | string, isAsc: boolean) {
    if (!a) {
      a = '0';
    }
    if (!b) {
      b = '0';
    }
    if (Number(a) && Number(a)) {
      // 両方数値に変換可能な場合は数値化
      a = Number(a);
      b = Number(b);
    }
    const result = (a > b ? 1 : -1) * (isAsc ? 1 : -1);
    return result;
  }

  /**
   * マスタ関連
   */

  // 指定されたidの要素を返す
  public getItemById(list: any, id: string): any {
    let element = null;
    list.forEach((item: { id: string; }) => {
      if (item.id === id) {
        element = item;
      }
    });
    return element;
  }

  // 別ウィンドウで表示
  openNewWindow(url: string, winName: string, options: string) {
    const _url = this.location.prepareExternalUrl(this.router.serializeUrl(
      this.router.createUrlTree([url])
  ));
    window.open(_url, winName, options);
  }

}
