import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StorageDatabase extends Dexie {
  private api: Dexie.Table<ApiKey, string>
  constructor() { 
    // database name
    super("news");

    // setup schema
    this.version(1).stores({
      api:'id'
    })

    this.api = this.table('api');
  }

  // api keys
  async hasKey():Promise<boolean> {
    return (await this.api.get('key')) != null
  }
  async getKey():Promise<string> {
    const k:ApiKey = await this.api.get('key');
    console.info(">>> apikey is ", k)
    return await k.apikey;
  }
  async saveKey (apikey:string):Promise<any> {
    const key:ApiKey = {
      id: 'key',
      apikey: apikey
    }
    return await this.api.put(key);
  }
  async deleteKey():Promise<any> {
    return await this.api.delete('key');
  }
}
