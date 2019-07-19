import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileFilter',
  pure: false
})
export class FileFilterPipe implements PipeTransform {

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
      return items.filter(item => (item.flName.split(' ')[0]).toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 && item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
    } else if (!isNullOrEmptyA && !isNullOrEmptyB) {
      return items.filter(item => (item.flName.split(' ')[0]).toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyB && !isNullOrEmptyC) {
      // tslint:disable-next-line: max-line-length
      return items.filter(item => (item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 && item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }
    else if (!isNullOrEmptyA && !isNullOrEmptyC) {
      return items.filter(item => (item.flName.split(' ')[0]).toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 && item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyA) {
      return items.filter(item => (item.flName.split(' ')[0]).toLowerCase().indexOf(filter.a.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyB) {
      return items.filter(item => (item.flUploadDate.split(' ')[0]).toLowerCase().indexOf(filter.b.toLowerCase()) !== -1);
    }
    else if (!isNullOrEmptyC) {
      return items.filter(item => (item.flUploadUser.split(' ')[0]).toLowerCase().indexOf(filter.c.toLowerCase()) !== -1);
    }

    //if all are empty=> true
    return items;
  }

}
