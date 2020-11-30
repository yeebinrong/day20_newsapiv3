import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageDatabase } from '../services/storage.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private db: StorageDatabase, private router:Router) { }

  ngOnInit(): void {
    this.db.hasKey()
    .then (bool => {
      if (!bool) {
        // check if user has api key stored, else redirect to settings
        alert("Please set your API key");
        this.router.navigate(['/settings'])
      }
    })
  }

}
