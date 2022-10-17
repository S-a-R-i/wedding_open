import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';


@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(value: string, defaultValue?: string): string {
    let result = value;
    const roleList = DataService.GET_ROLE_LIST();
    roleList.forEach((obj: { key: string; str: string; }) => {
      if (obj.key === value) {
        result = obj.str;
      }
    });
    return result;
  }
}
