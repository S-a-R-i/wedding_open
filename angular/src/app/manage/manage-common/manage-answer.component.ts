import { Component,} from '@angular/core';
import { ManageCommonComponent, ITEM } from './manage-common.component';

@Component({
  selector: 'manage-answer',
  templateUrl: './manage-common.component.html',
  styleUrls: ['./manage-common.component.css'],
})
export class ManageAnswerComponent extends ManageCommonComponent {
  masterPath = 't_question/getAnswer';
  masterName = '設定';
  itemList: ITEM[] = [
    {id: 'user_name', label: 'ユーザー名', width: 120},
    {id: 'event_name', label: 'イベント名', width: 120},
    {id: 'attend_flag', label: '出欠', width: 120},
    {id: 'comment', label: 'コメント', width: 120},
  ];

  preInit(): Promise<any> {
    this.canNotEditFlag = true;
    // 質問のタイトルを取得し、itemListにセット
    return this.dataService.getData('m_question', {})
    .then((res) => {
      res.forEach((obj: { question_no: any; title: any; }) => {
        this.itemList.push({id: String(obj.question_no), label: obj.title});
      });
    });
  }

  postLoad(res: any): any {
    // 質問に対する回答のセットと、登録日・更新日の取得
    let Datas: any = [];
    res.attend.forEach((attend: { family_name: string, first_name: string, user_name: string, user_id: string; insert_date: Date; update_date: Date; }) => {
      let eachData: any = [];
      attend.user_name = attend.family_name + attend.first_name;
      eachData = attend;
      let insert_date: Date;
      let update_date: Date;
      let pre_insert_date = attend.insert_date;
      let pre_update_date = attend.update_date;

      res.question.forEach((ques: { user_id: string; question_no: number; answer: string; insert_date: Date; update_date: Date;}) => {
        if (attend.user_id === ques.user_id) {
          insert_date = pre_insert_date < ques.insert_date ? pre_insert_date : ques.insert_date;
          update_date = pre_update_date < ques.update_date ? ques.update_date : pre_update_date;
          pre_update_date = ques.update_date;
          eachData[String(ques.question_no)] = ques.answer;
        }
        eachData['insert_date'] = insert_date;
        eachData['update_date'] = update_date;
      })
      Datas.push(eachData);
    })
    return Datas;
  }
  preDbProcess(processData: any) : Promise<any> {
    return Promise.resolve();
  }
}
