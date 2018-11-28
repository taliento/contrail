import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMinutes'
})
export class HoursMinutesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.floor(value / 60) + 'h ' + Math.floor(value % 60) + 'min';
  }

}
