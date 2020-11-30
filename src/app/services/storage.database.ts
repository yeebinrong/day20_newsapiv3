import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Country } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StorageDatabase extends Dexie {
  private api: Dexie.Table<ApiKey, string>;
  private list: Dexie.Table<Country[], string>;
  private articles: Dexie.Table<ApiKey, string>;
  constructor() { 
    // database name
    super("news");

    // setup schema
    this.version(1).stores({
      api:'id',
      list:'alpha2Code',
      articles:'publishedAt, code, saved'
    })

    this.api = this.table('api');
    this.list = this.table('list');
    this.articles = this.table('articles');
  }

  // api keys
  async hasKey():Promise<boolean> {
    return (await this.api.get('key')) != null
  }
  async getKey():Promise<string> {
    return (await this.api.get('key')).apikey;
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
