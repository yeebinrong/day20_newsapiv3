import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Country } from '../models';
import { ApiService } from '../services/api.service';
import { StorageDatabase } from '../services/storage.database';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {
  code:string;
  country:Country;
  articles:Article[]
  constructor(private db: StorageDatabase, private router:Router, private apiSvc:ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.params.code;
    this.db.getCountry(this.code)
    .then (results => {
      this.country = results;
      this.apiSvc.getArticles(this.code)
      .then (results => {
        this.articles = results;
      })
    })
  }

  // if image has error loading
  changeSource(e) {
    e.target.src = "assets/404.png"
  }
  // toggles the save article 
  async checkToggle(i) {
    i.saved = 1;
    const array:Article[] = []
    array.push(i);
    await this.db.saveArticles(array);
  }
}
