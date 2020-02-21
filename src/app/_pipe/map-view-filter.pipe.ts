import { Pipe, PipeTransform } from '@angular/core';
import { MappedThread } from '../models/mapped-thread';

@Pipe({
    name: 'mapViewFilter',
    pure: false
})
export class mapViewFilter implements PipeTransform {
    transform(items: any[], filter: { a: string, b: string[], c: string, d:string }): any {
        if (!items || !filter) {
            return items;
        }

        let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
        let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
        let isNullOrEmptyB: boolean = (filter.b == undefined || filter.b == null || filter.b.length == 0);
        let isNullOrEmptyD: boolean = (filter.d == undefined || filter.d == null || filter.d == '');

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        //case 1: all are not empty
        //case 2: A & B is empty .. only C is filled
        //case 3: only A is empty

        if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0 && 
                                        item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
        }
        else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0 && 
                                        item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
        }
        else if (!isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {
            return items.filter(item => item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0 && 
                                        item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
        }
        else if (!isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyA) {
            return items.filter(item => item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 && 
                                        item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
          }
          
          else if (!isNullOrEmptyD && !isNullOrEmptyA && !isNullOrEmptyB) {
            return items.filter(item => item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 && 
                                        item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0);
          }
          
          else if (!isNullOrEmptyA && !isNullOrEmptyB) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0);
          }
          
          
          else if (!isNullOrEmptyB && !isNullOrEmptyC) {
            return items.filter(item => item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0 && 
                                        item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
          }
          
          
          else if (!isNullOrEmptyC && !isNullOrEmptyD) {
            return items.filter(item => item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
          }
      
          else if (!isNullOrEmptyB && !isNullOrEmptyD) {
            return items.filter(item => item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
          }
      
          else if (!isNullOrEmptyA && !isNullOrEmptyC) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
          }
          
          
          else if (!isNullOrEmptyA && !isNullOrEmptyD) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && 
                                        item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
          }
          else if (!isNullOrEmptyA) {
            return items.filter(item => item.ThreadReferenceText.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
          }
          else if (!isNullOrEmptyB) {
            return items.filter(item => item.SelectedTypeIdList.filter(f => filter.b.includes(f)).length > 0);
          }
          else if (!isNullOrEmptyC) {
            return items.filter(item => item.ThreadSubject.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
          }
          else if (!isNullOrEmptyD) {
            return items.filter(item => item.Remarks.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1);
          }
      
          //if all are empty=> true
          return items;
        }
}