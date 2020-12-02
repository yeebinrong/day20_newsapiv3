import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, Country } from '../models';
import { StorageDatabase } from './storage.database';

const CODES = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'.split(' ').join(';');
const LIST_ENDPOINT = 'https://restcountries.eu/rest/v2/alpha?';
const NEWS_ENDPOINT = 'https://newsapi.org/v2/top-headlines';

const CACHE_TIME_LIMIT = 1000 * 60 * 5;

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
    let articles:Article[] = [];
    const bool = await this.db.hasArticles(code);
    let shouldRefresh:boolean = !bool;
    if (bool) {
      // has articles in db
      console.info("articles from db")
      articles = await this.db.getArticles(code)
      const FIRST_ARTICLE_NOT_SAVED = articles.find(e =>
        e.saved == 0
      )
      if (Date.now() - FIRST_ARTICLE_NOT_SAVED.timestamp >= CACHE_TIME_LIMIT ) {
        console.info("5 minutes has passed")
        await this.db.deleteArticles(articles.filter(a => !a.saved));
        articles = articles.filter(a => a.saved);
        shouldRefresh = true;
      }
    }
    if (shouldRefresh) {
      // does not have article in db
      console.info("should refresh")
      console.info("articles from api")

      // primary keys of all the saved articles
      const saveSet = new Set();
      articles.forEach(a => {
				saveSet.add(a.publishedAt)
      })
      
      const params = new HttpParams().set('category', 'general').set('pageSize', '30').set('country', code);
      const apikey = await this.db.getKey()
      const headers = new HttpHeaders().set('X-Api-Key', apikey);
      const data = (await this.http.get(NEWS_ENDPOINT, {headers: headers, params: params}).toPromise())['articles'];
      const results = data
        .filter(a => !saveSet.has(a.publishedAt))
        .map(d => {
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
          saved: 0,
          timestamp: Date.now()
        } as Article
      })

      this.db.saveArticles(results);
      articles = [...articles, ...results];
    }
    

    return Promise.resolve(articles);
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
