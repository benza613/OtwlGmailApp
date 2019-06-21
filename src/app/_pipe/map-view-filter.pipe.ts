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
        console.log('filter', filter);

        let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
        let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
        console.log('isNullOrEmptyC', isNullOrEmptyC);
        console.log('isNullOrEmptyA', isNullOrEmptyA);

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        if (!isNullOrEmptyA && !isNullOrEmptyC) {
            return items.filter(item => item.ThreadSubject.indexOf(filter.c) !== -1 && item.ThreadReferenceText.indexOf(filter.a) !== -1);
        } else if (!isNullOrEmptyC) {
            return items.filter(item => item.ThreadSubject.indexOf(filter.c) !== -1);
        }

        return items;

    }
}