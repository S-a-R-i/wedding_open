import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';


@Pipe({
  name: 'event'
})
export class EventPipe implements PipeTransform {
  transform(value: string, defaultValue?: string): string {
    let result = '';
    const eventList = DataService.GET_EVENT_LIST();
    eventList.forEach((obj: { key: string; str: string; }) => {
      if (obj.key === value) {
        result = obj.str;
      }
    });
    return result;
  }
}
