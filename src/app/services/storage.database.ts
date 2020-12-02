import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Article, Country } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StorageDatabase extends Dexie {
  private api: Dexie.Table<ApiKey, string>;
  private list: Dexie.Table<Country, string>;
  private articles: Dexie.Table<Article, string>;
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

  // article
  async hasArticles(code:string):Promise<boolean> {
    return (await this.articles.where('code').equalsIgnoreCase(code).toArray()).length > 0;
  }
  async getArticles(code:string):Promise<Article[]> {
    return await this.articles.where('code').equalsIgnoreCase(code).toArray();
  }
  async saveArticles(articles:Article[]):Promise<any> {
    return await this.articles.bulkPut(articles);
  }
  async deleteArticles(articles:Article[]):Promise<any> {
    return await this.articles.bulkDelete(articles.map(a => a.publishedAt));
  }

  // list
  async hasList():Promise<boolean> {
    return (await this.list.toArray()).length > 0;
  }
  async saveList(list:Country[]):Promise<any> {
    return await this.list.bulkPut(list);
  }
  async getList():Promise<Country[]> {
    return await this.list.toArray();
  }
  getCountry(code:string):Promise<Country> {
    return this.list.where('alpha2Code').equalsIgnoreCase(code)
    .toArray()
    .then(result => {
      if (result.length > 0)
        return result[0]
      return null
    })
  }
}
