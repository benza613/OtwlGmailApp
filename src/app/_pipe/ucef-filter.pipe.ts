import { Pipe, PipeTransform } from '@angular/core';
import { GlobalStoreService } from '../_store/global-store.service';

@Pipe({
  name: 'ucefFilter'
})
export class UcefFilterPipe implements PipeTransform {

  constructor(
    public globals: GlobalStoreService,
  ) { }

  transform(items: any[], filter: { a: string, b: string, c: string, d: string, e: string }): any {
    if (!items || !filter) {
      this.globals.ucefListFiltered = items;
      return items;
    }

    let isNullOrEmptyA: boolean = (filter.a == undefined || filter.a == null || filter.a == '');
    let isNullOrEmptyB: boolean = (filter.b == undefined || filter.b == null || filter.b == '');
    let isNullOrEmptyC: boolean = (filter.c == undefined || filter.c == null || filter.c == '');
    let isNullOrEmptyD: boolean = (filter.d == undefined || filter.d == null || filter.d == '');
    let isNullOrEmptyE: boolean = (filter.e == undefined || filter.e == null || filter.e == '');
    // console.log('isNullOrEmptyC', isNullOrEmptyC);
    // console.log('isNullOrEmptyB', isNullOrEmptyB);
    // console.log('isNullOrEmptyA', isNullOrEmptyA);

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    //case 1: all are not empty
    //case 2: A & B is empty .. only C is filled
    //case 3: only A is empty

    if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));


      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }


    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }


    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyC) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyB && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyB) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayNme.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyC && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyC && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyC) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    if (!isNullOrEmptyA && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyA) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_DisplayName.toLowerCase().indexOf(filter.a.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyC && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
      item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyC) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
      item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
      item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
      item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyB) {

      this.globals.ucefListFiltered = items.filter(item => (
        item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));

      return items.filter(item => (item.DirectoryDisplayName.toLowerCase().indexOf(filter.b.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyC && !isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
      item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyC && !isNullOrEmptyD) {

      this.globals.ucefListFiltered = items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
      item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyC && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyC) {

      this.globals.ucefListFiltered = items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));

      return items.filter(item => (item.Filetag.toLowerCase().indexOf(filter.c.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyD && !isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
      item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1 &&
        item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyD) {

    this.globals.ucefListFiltered = items.filter(item => (item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_Date_Upload.toLowerCase().indexOf(filter.d.toLowerCase()) !== -1));
    }

    else if (!isNullOrEmptyE) {

      this.globals.ucefListFiltered = items.filter(item => (item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));

      return items.filter(item => (item.FL_Size.toLowerCase().indexOf(filter.e.toLowerCase()) !== -1));
    }




    //if all are empty=> true
    this.globals.ucefListFiltered = items;
    return items;
  }

}
