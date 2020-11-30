import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailedComponent } from './components/detailed.component';
import { MainComponent } from './components/main.component';
import { SettingsComponent } from './components/settings.component';

const ROUTES: Routes = [
  {path:'', component: MainComponent},
  {path:'settings', component: SettingsComponent},
  {path:'detailed/:code', component: DetailedComponent},
  {path:'**', redirectTo:'', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
