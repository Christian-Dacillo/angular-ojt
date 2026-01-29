import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { SoaPdfComponent } from './app/soa-pdf/soa-pdf.component';

const routes: Routes = [
  { path: 'soa', component: SoaPdfComponent },
  { path: '', redirectTo: 'soa', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
