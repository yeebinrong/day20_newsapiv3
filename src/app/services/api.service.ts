import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, Country } from '../models';
import { StorageDatabase } from './storage.database';

const CODES = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'.split(' ').join(';');
const LIST_ENDPOINT = 'https://restcountries.eu/rest/v2/alpha?';
const NEWS_ENDPOINT = 'https://newsapi.org/v2/top-headlines';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  countryList:Country[] = [];
  constructor(private http:HttpClient, private db:StorageDatabase) { }

  async getList ():Promise<Country[]> {
    let results:Country[] = [];
    let bool = await this.db.hasList();
    if (bool) {
      console.info("list from db")
      results = await this.db.getList()
    } else {
      console.info("list from api")
      const params = new HttpParams().set('codes', CODES);
      results = await this.http.get<Country[]>(LIST_ENDPOINT, { params: params}).toPromise();
    }
    this.countryList = this.mapList(results);
    this.db.saveList(this.countryList);
    return Promise.resolve(this.countryList);
  }

  async getArticles(code:string):Promise<Article[]> {
    // check if db has articles
    // if true retrieve those articles
    // check find first article that is not saved
    // check if it is passed 5minutes
    // if true set to refresh and delete all article that is not saved
    // get new articles from api use current articles from db to filter the rest
    // return the articles
    const params = new HttpParams().set('category', 'general').set('pageSize', '30').set('country', code);
    const apikey = await this.db.getKey()
    const headers = new HttpHeaders().set('X-Api-Key', apikey);
    const data = (await this.http.get(NEWS_ENDPOINT, {headers: headers, params: params}).toPromise())['articles'];
    const results:Article[] = data.map(d => {
      return {
        code: code,
        author: d.author,
        content: d.content,
        description: d.description,
        publishedAt: d.publishedAt,
        source: d.source,
        title: d.title,
        url: d.url,
        urlToImage: d.urlToImage,
        saved: false,
        timestamp: Date.now()
      } as Article
    })
    this.db.saveArticles(results);
    return Promise.resolve(results);
  }

  //// PRIVATE FUNCTIONS ////
  private mapList(list:Country[]):Country[] {
    return list.map(i => {
      return {
        alpha2Code: i.alpha2Code,
        name: i.name,
        flag: i.flag
      } as Country
    })
  }
}
