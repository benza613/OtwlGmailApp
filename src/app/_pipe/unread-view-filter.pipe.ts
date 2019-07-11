import { Subject } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unreadViewFilter',
  pure: false
})
export class UnreadViewFilterPipe implements PipeTransform {

  transform(items: any[], filter: { a: string, b: string, c: string }): any {
    if (!items || !filter) {
        return items;
    }
    let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
    let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
    let isNullOrEmptyB: boolean = (filter.b == undefined || filter.b == null || filter.b == '');
    // console.log('isNullOrEmptyC', isNullOrEmptyC);
    // console.log('isNullOrEmptyB', isNullOrEmptyB);
    // console.log('isNullOrEmptyA', isNullOrEmptyA);

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    //case 1: all are not empty
    //case 2: A & B is empty .. only C is filled
    //case 3: only A is empty

    if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC) {
        return items.filter(item => (item.Msg_Date.split(' ')[0]).toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && item.Subject.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 && item.Msg_From.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyA && !isNullOrEmptyB) {
        return items.filter(item => item.Subject.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 && item.Msg_From.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyB && !isNullOrEmptyC) {
        return items.filter(item => (item.Msg_Date.split(' ')[0]).toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && item.Subject.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyA && !isNullOrEmptyC) {
        return items.filter(item => (item.Msg_Date.split(' ')[0]).toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && item.Msg_From.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyA) {
        return items.filter(item => item.Msg_From.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyB) {
        return items.filter(item => item.Subject.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyC) {
        return items.filter(item => (item.Msg_Date.split(' ')[0]).toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
    }

    //if all are empty=> true
    return items;

}
}
