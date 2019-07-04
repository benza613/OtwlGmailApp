import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService, StorageTranscoders } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public fetchMessagePacket(STORAGE_KEY: string): void {
    // get array of tasks from local storage
    let x = this.storage.get(STORAGE_KEY, StorageTranscoders.JSON) || {};
    return x;
  }
}

