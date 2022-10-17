import { Component,} from '@angular/core';
import { ManageCommonComponent, ITEM } from './manage-common.component';


@Component({
  selector: 'manage-user',
  templateUrl: './manage-common.component.html',
  styleUrls: ['./manage-common.component.css'],
})
export class ManageUserComponent extends ManageCommonComponent {
  masterPath = 'm_user';
  masterName = 'ユーザー';
  itemList: ITEM[] = [
    {id: 'user_id', label: 'ユーザID', width: 80, type: 'text', primary: true, readOnly: true, maxlength: 10},
    {id: 'family_name', label: '姓', width: 150, type: 'text', required: true, pattern: '^[ぁ-ん]*$', patternExp: 'ひらがな', maxlength: 10},
    {id: 'first_name', label: '名', width: 150, type: 'text', required: true, pattern: '^[ぁ-ん]*$', patternExp: 'ひらがな', maxlength: 10},
    {id: 'password', label: 'パスワード', width: 150, type: 'text', required: true, pattern: '^[0-9a-zA-Z]*$', patternExp: '8桁以上の半角英数字', minlength: 8, maxlength: 30},
    {id: 'role', label: '権限', width: 120, type: 'select', pipe: 'role', required: true, list: null},
    {id: 'event_id', label: '参加イベント', width: 120, type: 'select', pipe: 'event', required: true, list: null},
  ];

  override disableCond = {disableId: 'event_id', targetId: 'role', targetValue: '010104'};

  preInit(): Promise<any> {
    // 権限と参加イベントのリスト選択肢を取得
    const roleItem = this.commonService.getItemById(this.itemList, 'role');
    const eventItem = this.commonService.getItemById(this.itemList, 'event_id');

    const roleList = this.dataService.getRoleList() as any;
    const eventList = this.dataService.getEventList() as any;
    if ( !roleList || !eventList ) {
      return this.dataService.getData('m_user/getpreInitData', {cls_1: '01', cls_2: '01'})
      .then((res) => {
        roleItem.list = res.role_list;
        eventItem.list = [];
        res.event_list.forEach((event: { event_id: any; event_name: any; }) => {
          eventItem.list.push({key: event.event_id, str: event.event_name})
        });
        this.dataService.setRoleList(roleItem.list);
        this.dataService.setEventList(eventItem.list);
      });
    }
    roleItem.list = this.dataService.getRoleList();
    eventItem.list = this.dataService.getEventList();
    return Promise.resolve();
  }

  postLoad(res: any): any { return res; };
  preDbProcess(processData: any): Promise<any> {
    // user_idの設定をする
    if (!this.editData.user_id) {
      return this.dataService.getData('m_user/getUserId', {})
      .then((res: any) => {
        processData.user_id = res.user_id;
      })
    } else {
      return Promise.resolve();
    }
  }
}
