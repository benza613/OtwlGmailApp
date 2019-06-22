import { Pipe, PipeTransform } from '@angular/core';
import { MappedThread } from '../models/mapped-thread';

@Pipe({
    name: 'mapViewFilter',
    pure: false
})
export class mapViewFilter implements PipeTransform {
    transform(items: any[], filter: { a: string, b: string[], c: string }): any {
        if (!items || !filter) {
            return items;
        }

        let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
        let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
        let isNullOrEmptyB: boolean = (filter.b == undefined || filter.b == null || filter.b.length == 0);
        console.log('isNullOrEmptyC', isNullOrEmptyC);
        console.log('isNullOrEmptyA', isNullOrEmptyA);

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        //case 1: all are not empty
        //case 2: A & B is empty .. only C is filled
        //case 3: only A is empty
        if (!isNullOrEmptyA && !isNullOrEmptyC) {
            return items.filter(item => item.ThreadSubject.indexOf(filter.c) !== -1 && item.ThreadReferenceText.indexOf(filter.a) !== -1);
        }
        else if (isNullOrEmptyA && !isNullOrEmptyC) {
            return items.filter(item => item.ThreadSubject.indexOf(filter.c) !== -1);
        }
        else if (isNullOrEmptyC && !isNullOrEmptyA) {
            return items.filter(item => item.ThreadReferenceText.indexOf(filter.a) !== -1);
        }

        //if all are empty=> true
        return items;

    }
}