import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SoaSection {
  title: string;
  rows: [string, number][];
}

export interface Soa {
  soaNo: string;
  date: string;
  name: string;
  address: string;
  type: string;
  particulars: string;
  periodCovered: string;
  sections: SoaSection[];
}

@Injectable({
  providedIn: 'root'
})
export class SoaService {

  getSoaDetails(): Observable<Soa> {
    return of({
      soaNo: 'SOA-2026-001',
      date: 'October 29, 2003',
      name: 'Christian Dacillo',
      address: 'Salugan Camalig',
      type: 'New',
      particulars: 'Application Fees',
      periodCovered: '2026',
      sections: [
        {
          title: 'FOR LICENSES',
          rows: [
            ['Permit to Purchase', 384],
            ['Filing Fee', 720],
            ['Permit to Possess / Storage', 240],
            ['Construction Permit Fee', 0],
            ['Radio Station License', 0],
            ['Inspection Fee', 2640],
            ['Spectrum User’s Fee (SUF)', 88],
            ['Surcharges', 0],
            ['Fines and Penalties', 0]
          ]
        },
        {
          title: 'FOR PERMITS',
          rows: [
            ['Permit (Dealer / Reseller / Service Center)', 0],
            ['Inspection Fee', 0],
            ['Filing Fee', 0],
            ['Surcharges', 0]
          ]
        },
        {
          title: 'FOR AMATEUR AND ROC',
          rows: [
            ['Radio Station License', 0],
            ['Radio Operator’s Certificate', 0],
            ['Application Fee', 0],
            ['Filing Fee', 0],
            ['Seminar Fee', 0],
            ['Surcharges', 0]
          ]
        },
        {
          title: 'OTHER APPLICATION',
          rows: [
            ['Registration Fee', 0],
            ['Supervision Regulation Fee', 0],
            ['Verification / Authentication Fee', 0],
            ['Examination Fee', 0],
            ['Clearance / Certification Fee (Special)', 0],
            ['Modification Fee', 0],
            ['Miscellaneous Income', 0],
            ['Documentary Stamp Tax (DST)', 120],
            ['Others', 0]
          ]
        }
      ]
    });
  }
}
