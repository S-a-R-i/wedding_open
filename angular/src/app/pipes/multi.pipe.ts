import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RolePipe } from './role.pipe';
import { EventPipe } from './event.pipe';
import { DressPipe } from './dress.pipe';
import { AnsWeyPipe } from './answay.pipe';

@Pipe({
  name: 'multi'
})
export class MultiPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe,
    private rolePipe: RolePipe,
    private eventPipe: EventPipe,
    private dressPipe: DressPipe,
    private ansWayPipe: AnsWeyPipe,

  ) {}

  transform(value: string, pipeName: string, param?: string): string {
    let result = value;
    if (!value || !pipeName) {
      return result;
    }
    if (pipeName === 'date') {
      result = this.datePipe.transform(value, param) as string;
    } else if (pipeName === 'role') {
      result = this.rolePipe.transform(value, param);
    } else if (pipeName === 'event') {
      result = this.eventPipe.transform(value, param);
    } else if (pipeName === 'dress') {
      result = this.dressPipe.transform(value, param);
    } else if (pipeName === 'answay') {
      result = this.ansWayPipe.transform(value, param);
    }

    return result;
  }
}
