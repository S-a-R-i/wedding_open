import { Component,} from '@angular/core';
import { ManageCommonComponent, ITEM } from './manage-common.component';

@Component({
  selector: 'manage-question',
  templateUrl: './manage-common.component.html',
  styleUrls: ['./manage-common.component.css'],
})
export class ManageQuestionComponent extends ManageCommonComponent {
  masterPath = 'm_question';
  masterName = '質問';
  itemList: ITEM[] = [
    {id: 'question_no', label: '質問番号', width: 80, type: 'text', primary: true, readOnly: true, maxlength: 10},
    {id: 'title', label: 'タイトル ' , width: 600, type: 'text', required: true, maxlength: 10},
    {id: 'question', label: '質問内容' , width: 600, type: 'text', required: true, maxlength: 1000},
    {id: 'answer_way', label: '回答方法', width: 100, type: 'select', required: true, pipe: 'answay', list: [{ key: '1', str: 'テキスト入力'}, { key: '2', str: 'リスト選択'}]},
    {id: 'disp_order', label: '表示順', width: 100, type: 'number', required: true},
  ];

  preInit(): Promise<any> {
    return Promise.resolve();
  }
  postLoad(res: any): any { return res; };
  preDbProcess(processData: any) : Promise<any> {
    // question_noの設定をする
    if (!this.editData.question_id) {
      return this.dataService.getData('m_question/getQuestionNo', {})
      .then((res: any) => {
        processData.question_no = res.question_no;
      })
    } else {
      return Promise.resolve();
    }
  }
}
