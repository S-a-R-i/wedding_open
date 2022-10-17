import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'answay'
})
export class AnsWeyPipe implements PipeTransform {
  transform(value: string, defaultValue?: string): string {
    let result = '';
    if (value === '1') {
      result = 'テキスト入力';
    } else if (value === '2') {
      result = 'リスト選択';
    }
    return result;
  }
}
