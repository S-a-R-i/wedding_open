import { OnInit, Directive, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { Sort} from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

export interface ITEM {
  id: string;
  label: string;
  width?: number;
  type?: string;
  primary?: boolean;
  required?: boolean;
  readOnly?: boolean;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  patternExp?: string;
  pipe?: string;
  pipeParam?: string;
  list?: any;
  notEdit?: boolean;
  disabled?: boolean;
  long?: boolean;
}

@Directive({
  selector: '[manageCommonMaster]'
})
export abstract class ManageCommonComponent implements OnInit, AfterViewInit {
  // DBアクセス時のURL
  abstract masterPath: string;
  // 画面名
  abstract masterName: string;

  public loginUserId = '';
  public loginUserName = '';
  public dataList = []; // 一覧データ
  public sortedList = [];
  public editData: any = [];
  public dataSource!: MatTableDataSource<any>;
  public filterCondition: any = {};
  private sortCondition!: Sort;
  public infoMessage = '';
  public canNotEditFlag = false;

  // disable条件 disableId:非活性にする要素、targetId:disable判定対象の要素、targetValue:disableになるときの値
  public disableCond = {disableId: '', targetId: '', targetValue: ''};
  public disableId = ''; // 実際にdisableする場合idを格納

  // 登録/更新切替用
  public inputMode = true;
  public selectedKey = '';
  public hideInfoMsg = false;

  abstract itemList: ITEM[];
  private commonItemList: ITEM[] = [
    {id: 'insert_date', label: '登録日', width: 150, type: 'date', readOnly: true, notEdit: true, pipe: 'date', pipeParam: 'yyyy/MM/dd HH:mm:ss'},
    {id: 'update_date', label: '更新日', width: 150, type: 'date', readOnly: true, notEdit: true, pipe: 'date', pipeParam: 'yyyy/MM/dd HH:mm:ss'},
  ];

  public tableColumnNames:any = [];
  public tableColumnItems:any = [];

  public today = new Date();
  public dispLogout = false;

  constructor(
    public dataService: DataService,
    public commonService: CommonService,
    public loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
  ){
    this.loginUserId = this.loginService.getUserId();
    this.loginUserName = this.loginService.getUserName();
  }

  // 初期化前処理
  abstract preInit(): Promise<any>;
  // データ取得後処理
  abstract postLoad(dataList: any): any;
  // DB反映前処理
  abstract preDbProcess(processData: any): Promise<any>;


  // メニューバーの設定
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sidenav?.open();
    }, 250);
  }

  // 報告ページを別ウィンドウで表示
  openNewWindow(url: string, winName: string, options: string) {
    this.commonService.openNewWindow(url, winName, options);
  }

  ngOnInit(): void {
    this.preInit()
    .then((res) => {
      // 各マスタの項目と共通項目をそれぞれセット
      this.itemList.forEach(item => {
        this.tableColumnNames.push(item.id);
        this.tableColumnItems.push(item);
        // 編集用変数に項目を追加（共通項目を除く）
        this.editData.push(item);
      });
      this.commonItemList.forEach(item => {
        this.tableColumnNames.push(item.id);
        this.tableColumnItems.push(item);
      });
      this.initializeEditData();
      return this.loadDatas();
    });
  }

  // 一覧データ取得
  private loadDatas() {
    this.dataService.getData(this.masterPath, {})
    .then((res) => {
      if (res) {
        const data = this.postLoad(res);
        this.dataList = data;
        this.dataList.forEach(row => {
          this.setKey(row);
        });
        this.sortedList = this.dataList.slice();
        this.setDataSource();
      }
    });
  }

  // テーブルデータ選択
  public selectData(selectData: any) {
    if (this.selectedKey === selectData.key) {
      // 選択解除
      this.initializeEditData();
      this.selectedKey = '';
      this.inputMode = true;
    } else {
      this.editData.forEach((eData: { id: any; value: any; }) => {
        eData.value = selectData[eData.id];
        this.setDisableId(eData);
      });
      this.selectedKey = selectData.key;
      this.inputMode = false;
    }
  }

  // select選択時
  public setDisableId(item: any) {
    if (this.disableCond.targetId && this.disableCond.targetId === item.id && this.disableCond.targetValue !== item.value) {
      this.editData.some((data: { id: string; disabled: boolean; value: string; }) => {
        if (data.id === this.disableCond.disableId) {
          data.disabled = true;
          data.value = '';
        }
      })
    } else if (this.disableCond.targetId && this.disableCond.targetId === item.id && this.disableCond.targetValue === item.value) {
      this.editData.some((data: { id: string; disabled: boolean; value: string; }) => {
        if (data.id === this.disableCond.disableId) {
          data.disabled = false;
        }
      })
    }
  }

  // 表示用のテーブルデータをセット
  private setDataSource() {
    this.dataSource = new MatTableDataSource(this.sortedList) as any ;
  }

  // DBアクセス時のPKをセット
  private setKey(setData: any) {
    let key = '';
    this.itemList.forEach((item) => {
      if (item.primary) {
        key += setData[item.id];
      }
    });
    setData.key = key;
  }

  // 絞り込み表示
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ソート
  public sort(sort: any) {
    this.sortCondition = sort;
    this.sortData();
  }
  private sortData() {
    this.sortedList = this.commonService.sortData(this.sortCondition, this.dataList);
    this.setDataSource();
  }

  public initializeEditData() {
    this.editData.forEach((item: { value: string; }) =>  {
      item.value = '';
    });
  }

  private setProcessData(list: any): any {
    let processData:any = {};
    list.forEach((item: {id: string, value: string}) => {
      processData[item.id] = item.value;
    });
    return processData
  }


  public registData() {
    this.hideInfoMsg = false;
    let processData = this.setProcessData(this.editData);
    processData.insert_user_id = this.loginUserId;
    processData.update_user_id = this.loginUserId;
    this.preDbProcess(processData)
    .then((res) => {
      this.setKey(processData);
      this.dataService.postData(this.masterPath, processData, true)
      .then((res) => {
        if (res) {
          this.infoMessage = '登録しました';
          this.inputMode = true;
          this.initializeEditData();
          this.loadDatas();
        }
      });
    })
  }


  public updateData() {
    this.hideInfoMsg = false;
    let processData = this.setProcessData(this.editData);
    processData.update_user_id = this.loginUserId;
    this.setKey(processData);
    this.dataService.putData(this.masterPath + '/' + processData.key, processData, true)
    .then((res) => {
      if (res) {
        this.infoMessage = '更新しました';
        this.inputMode = true;
        this.initializeEditData();
        this.loadDatas();
      }
    });
  }

  public deleteData() {
    this.hideInfoMsg = false;
    let processData = this.setProcessData(this.editData);
    this.setKey(processData);
    this.commonService.showConfirmDialogPromise('当該データを削除します\nよろしいですか？')
    .then(check => {
      if (check) {
        this.dataService.deleteData(this.masterPath + '/' + processData.key, {}, true)
        .then((res) => {
          if (res) {
            this.infoMessage = '削除しました';
            this.inputMode = true;
            this.initializeEditData();
            this.loadDatas();
          }
        });
      }
    });
  }

  public logout() {
    this.loginService.logout();
  }
}
