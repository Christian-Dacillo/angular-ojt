import { TestBed } from '@angular/core/testing';
import { SoaPdfComponent } from './soa-pdf.component';
import { SoaService, Soa } from '../services/soa.service';
import { of } from 'rxjs';

describe('SoaPdfComponent', () => {
  let component: SoaPdfComponent;
  let soaServiceSpy: jasmine.SpyObj<SoaService>;

  const mockSoa: Soa = {
    soaNo: 'MOCK-001',
    date: 'Mock Date',
    name: 'Mock User',
    address: 'Mock Address',
    type: 'New',
    particulars: 'Mock Particulars',
    periodCovered: '2026',
    sections: [
      {
        title: 'FOR LICENSES', rows: [
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
        title: 'FOR PERMITS', rows: [
          ['Permit (Dealer / Reseller / Service Center)', 0],
          ['Inspection Fee', 0],
          ['Filing Fee', 0],
          ['Surcharges', 0]
        ]
      },
      {
        title: 'FOR AMATEUR AND ROC', rows: [
          ['Radio Station License', 0],
          ['Radio Operator’s Certificate', 0],
          ['Application Fee', 0],
          ['Filing Fee', 0],
          ['Seminar Fee', 0],
          ['Surcharges', 0]
        ]
      },
      {
        title: 'OTHER APPLICATION', rows: [
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
  };

  beforeEach(async () => {
    soaServiceSpy = jasmine.createSpyObj('SoaService', ['getSoaDetails']);
    soaServiceSpy.getSoaDetails.and.returnValue(of(mockSoa));

    await TestBed.configureTestingModule({
      imports: [SoaPdfComponent],
      providers: [{ provide: SoaService, useValue: soaServiceSpy }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SoaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call SOA service and populate data', (done) => {
    component.generatePDF();
    setTimeout(() => {
      expect(component.soaData.soaNo).toBe('MOCK-001');
      expect(soaServiceSpy.getSoaDetails).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should generate table with all sections and bills', () => {
    component.soaData = mockSoa;
    const table = component.createSoaTable();

    // Check headers
    expect(table.table.body[0][0].text).toBe('CODE');
    expect(table.table.body[0][1].text).toBe('PARTICULARS');
    expect(table.table.body[0][2].text).toBe('TOTAL');

    // Check section titles
    expect(table.table.body.some((row: { text: string; }[]) => row[0]?.text === 'FOR LICENSES')).toBeTrue();
    expect(table.table.body.some((row: { text: string; }[]) => row[0]?.text === 'FOR PERMITS')).toBeTrue();
    expect(table.table.body.some((row: { text: string; }[]) => row[0]?.text === 'FOR AMATEUR AND ROC')).toBeTrue();
    expect(table.table.body.some((row: { text: string; }[]) => row[0]?.text === 'OTHER APPLICATION')).toBeTrue();

    // Check some sample bills
    expect(table.table.body.some((row: string[]) => row[1] === 'Permit to Purchase')).toBeTrue();
    expect(table.table.body.some((row: string[]) => row[1] === 'Filing Fee')).toBeTrue();
    expect(table.table.body.some((row: string[]) => row[1] === 'Inspection Fee')).toBeTrue();
    expect(table.table.body.some((row: string[]) => row[1] === 'Documentary Stamp Tax (DST)')).toBeTrue();

    // Check total amount exists
    expect(table.table.body.some((row: { text: string; }[]) => row[0]?.text === 'TOTAL AMOUNT')).toBeTrue();
  });
});
