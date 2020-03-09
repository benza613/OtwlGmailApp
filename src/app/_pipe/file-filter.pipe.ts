import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileFilter',
  pure: false
})
export class FileFilterPipe implements PipeTransform {

  transform(items: any[], filter: { a: string, b: string, c: string, d: string }): any {
    if (!items || !filter) {
      return items;
    }

    let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
    let isNullOrEmptyB: boolean = (filter.b == undefined || filter.b == null || filter.b == '');
    let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
    let isNullOrEmptyD: boolean = (filter.d == undefined || filter.d == null || filter.d == '');

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    //case 1: all are not empty
    //case 2: A & B is empty .. only C is filled
    //case 3: only A is empty

    if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }
    
    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }
    
    
    else if (!isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {
      return items.filter(item => (item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }
    
    else if (!isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyA) {
      return items.filter(item => (item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1));
    }
    
    else if (!isNullOrEmptyD && !isNullOrEmptyA && !isNullOrEmptyB) {
      return items.filter(item => (item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));
    }
    
    else if (!isNullOrEmptyA && !isNullOrEmptyB) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));
    }
    
    
    else if (!isNullOrEmptyB && !isNullOrEmptyC) {
      return items.filter(item => (item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }
    
    
    else if (!isNullOrEmptyC && !isNullOrEmptyD) {
      return items.filter(item => (item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyD) {
      return items.filter(item => (item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyC) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }
    
    
    else if (!isNullOrEmptyA && !isNullOrEmptyD) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }
    else if (!isNullOrEmptyA) {
      return items.filter(item => (item.flName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1));
    }
    else if (!isNullOrEmptyB) {
      return items.filter(item => (item.flUploadDate.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));
    }
    else if (!isNullOrEmptyC) {
      return items.filter(item => (item.flUploadUser.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }
    else if (!isNullOrEmptyD) {
      return items.filter(item => (item.flTag.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    //if all are empty=> true
    return items;
  }

}
