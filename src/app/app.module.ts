import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiService } from './services/api.service';
import { StorageDatabase } from './services/storage.database';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main.component';
import { SettingsComponent } from './components/settings.component';
import { DetailedComponent } from './components/detailed.component';
import { FormComponent } from './components/templates/form.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    DetailedComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
  providers: [ApiService, StorageDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
