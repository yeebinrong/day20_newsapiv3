import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../models';
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
  constructor(private db: StorageDatabase, private router:Router, private apiSvc:ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.params.code;
    this.db.getCountry(this.code)
    .then (results => {
      this.country = results;
    })
  }

}
