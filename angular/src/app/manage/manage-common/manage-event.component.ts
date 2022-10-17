import { Component,} from '@angular/core';
import { ManageCommonComponent, ITEM } from './manage-common.component';

@Component({
  selector: 'manage-event',
  templateUrl: './manage-common.component.html',
  styleUrls: ['./manage-common.component.css'],
})
export class ManageEventComponent extends ManageCommonComponent {
  masterPath = 'm_event';
  masterName = 'イベント';
  itemList: ITEM[] = [
    {id: 'event_id', label: 'イベントID', width: 80, type: 'text', primary: true, readOnly: true, maxlength: 10},
    {id: 'event_name', label: 'イベント名', width: 150, type: 'text', required: true, maxlength: 100, long: true},
    {id: 'date_time', label: '開催日時', width: 150, type: 'date', required: true},
    {id: 'place', label: '会場名', width: 200, type: 'text', required: true, maxlength: 100, long: true},
    {id: 'address', label: '住所', width: 300, type: 'text', required: true, maxlength: 100, long: true},
    {id: 'latitude', label: '緯度', width: 80, type: 'text', required: true, maxlength: 100},
    {id: 'longitude', label: '経度', width: 80, type: 'text', required: true, maxlength: 100},
    {id: 'price', label: '会費', width: 100, type: 'text', required: true, maxlength: 10},
    {id: 'dress_code', label: 'ドレスコード', width: 150, type: 'select', required: true, pipe: 'dress', list: [{ key: 1, str: 'あり'}, { key: 2, str: 'なし'}]},
  ];

  preInit(): Promise<any> {
    return Promise.resolve();
  }
  postLoad(res: any): any { return res; };
  preDbProcess(processData: any) : Promise<any> {
    const eventList = this.dataService.getEventList() as any;
    eventList.push({key: processData.event_id, str: processData.event_name});
    this.dataService.setEventList(eventList);

    // event_idの設定をする
    if (!this.editData.event_id) {
      return this.dataService.getData('m_event/getEventId', {})
      .then((res: any) => {
        processData.event_id = res.event_id;
      })
    } else {
      return Promise.resolve();
    }
  }

}
