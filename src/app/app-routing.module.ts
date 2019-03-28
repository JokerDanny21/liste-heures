import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HoursListComponent } from './hours-list/hours-list.component';
import { ListDetailComponent } from './hours-list/list-detail/list-detail.component';
import { ListEditComponent } from './hours-list/list-edit/list-edit.component';

const routes: Routes = [
  {
    path: 'list', component: HoursListComponent, children: [
      { path: ':id', component: ListDetailComponent },
      { path: ':id/edit', component: ListEditComponent },
    ],
  },
  { path: 'new', component: ListEditComponent },

  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
