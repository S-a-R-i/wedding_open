import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'dress'
})
export class DressPipe implements PipeTransform {
  transform(value: string, defaultValue?: string): string {
    let result = '';
    if (value === '1') {
      result = 'ăă';
    } else if (value === '2') {
      result = 'ăȘă';
    }
    return result;
  }
}
