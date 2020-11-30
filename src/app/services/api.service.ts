import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models';

const CODES = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'.split(' ').join(';');
const LIST_ENDPOINT = 'https://restcountries.eu/rest/v2/alpha?';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  getList ():Promise<Country[]> {
    const params = new HttpParams().set('codes', CODES)
    return this.http.get<Country[]>(LIST_ENDPOINT, { params: params}).toPromise();
  }
}
