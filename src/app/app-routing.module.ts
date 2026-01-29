import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoaPdfComponent } from './soa-pdf/soa-pdf.component';

const routes: Routes = [
  { path: 'soa', component: SoaPdfComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
