import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getMaxListeners } from 'process';
import { Country } from '../models';
import { ApiService } from '../services/api.service';
import { StorageDatabase } from '../services/storage.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  countryList:Country[] = [];
  constructor(private db: StorageDatabase, private router:Router, private apiSvc:ApiService) { }

  ngOnInit(): void {
    this.db.hasKey()
    .then (bool => {
      if (!bool) {
        // check if user has api key stored, else redirect to settings
        alert("Please set your API key");
        this.router.navigate(['/settings'])
      }
    })
    this.getList();
  }

  getList () {
    this.apiSvc.getList()
    .then (results => {
      this.countryList = results.map(i => {
        return {
          alpha2Code: i.alpha2Code,
          name: i.name,
          flag: i.flag
        } as Country
      })
    })
  }
}
