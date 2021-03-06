import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageDatabase } from 'src/app/services/storage.database';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  _form:FormGroup;
  constructor(private fb: FormBuilder, private db:StorageDatabase, private router:Router) { }

  ngOnInit(): void {
    this.initForm();
    // check if db has key
    this.db.hasKey()
    .then (bool => {
      if (bool) {
        // get key from db
        this.db.getKey()
        .then (key => {
          // sets the key to the form value
          this._form.patchValue({
            apikey: key
          })
        })
      }
    })
  }

  // saves key onto db
  async saveKey () {
    await this.db.saveKey(this._form.get('apikey').value)
    this.router.navigate(['/'])
  }
  // deletes key from db
  async deleteKey () {
    await this.db.deleteKey();
    this.router.navigate(['/'])
  }

  //// PRIVATE ////
  // Initialises the form
  private initForm () {
    this._form = this.fb.group({
      apikey: this.fb.control('', [Validators.required])
    })
  }
}
