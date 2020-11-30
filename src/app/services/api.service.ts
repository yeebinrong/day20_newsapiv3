import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models';
import { StorageDatabase } from './storage.database';

const CODES = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'.split(' ').join(';');
const LIST_ENDPOINT = 'https://restcountries.eu/rest/v2/alpha?';

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
