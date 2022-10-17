import { Component,} from '@angular/core';
import { ManageCommonComponent, ITEM } from './manage-common.component';

@Component({
  selector: 'manage-system',
  templateUrl: './manage-common.component.html',
  styleUrls: ['./manage-common.component.css'],
})
export class ManageSystemComponent extends ManageCommonComponent {
  masterPath = 'm_system';
  masterName = '設定';
  itemList: ITEM[] = [
    {id: 'cls_1', label: '区分1', width: 120, type: 'text', primary: true, maxlength: 2, minlength: 2},
    {id: 'cls_2', label: '区分2', width: 120, type: 'text', primary: true, maxlength: 2, minlength: 2},
    {id: 'cls_3', label: '区分3', width: 120, type: 'text', primary: true, maxlength: 2, minlength: 2},
    {id: 'name', label: '名称', width: 120, type: 'text', maxlength: 100},
    {id: 'str', label: '文字列' , width: 200, type: 'text', required: true, maxlength: 100},
  ];

  preInit(): Promise<any> {
    return Promise.resolve();
  }
  postLoad(res: any): any { return res; };
  preDbProcess(processData: any) : Promise<any> {
    if (processData.cls_1 === '01') {
      const roleList = this.dataService.getRoleList() as any;
      roleList.push({key: processData.key, str: processData.str});
      this.dataService.setRoleList(roleList);
    }
    return Promise.resolve();
  }
}
