import { Component } from '@angular/core';
import { SoaService, Soa, SoaSection } from '../services/soa.service';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-soa-pdf',
  standalone: true,
  template: `<button (click)="generatePDF()">Generate SOA PDF</button>`
})
export class SoaPdfComponent {
  soaData!: Soa;

  constructor(private soaService: SoaService) { }

  
  generatePDF(): void {
    this.soaService.getSoaDetails().subscribe(data => {
      this.soaData = data;

      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [10, 10, 10, 10],
        content: [
          {
            columns: [
              this.soaColumn('Sending Unit Copy'),
              this.soaColumn('Commission Copy'),
              this.soaColumn('COA Copy'),
              this.soaColumn('Cash Unit Copy')
            ],
            columnGap: 5
          }
        ]
      };

      pdfMake.createPdf(docDefinition).open();
    });
  }

  
  createSoaTable(): any {
    const body: any[] = [
      [
        { text: 'CODE', bold: true },
        { text: 'PARTICULARS', bold: true },
        { text: 'TOTAL', bold: true, alignment: 'right' }
      ]
    ];

    this.soaData.sections.forEach((section: SoaSection) => {
      body.push([{ text: section.title, colSpan: 3, bold: true }, {}, {}]);
      section.rows.forEach(row => {
        body.push(['', row[0], { text: row[1].toFixed(2), alignment: 'right' }]);
      });
    });

    const totalAmount = this.soaData.sections
      .flatMap(sec => sec.rows)
      .reduce((sum, r) => sum + r[1], 0);

    body.push([
      { text: 'TOTAL AMOUNT', colSpan: 2, bold: true, alignment: 'right' },
      {},
      { text: totalAmount.toFixed(2), bold: true, alignment: 'right' }
    ]);

    return {
      table: { widths: [18, '*', 45], body },
      fontSize: 7,
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        paddingLeft: () => 3,
        paddingRight: () => 3,
        paddingTop: () => 2,
        paddingBottom: () => 2
      }
    };
  }

 
  soaColumn(label: string): any {
    return {
      width: '25%',
      stack: [
        { text: 'NATIONAL TELECOMMUNICATIONS COMMISSION', bold: true, fontSize: 8, alignment: 'center' },
        { text: 'Statement of Account', fontSize: 7, alignment: 'center' },
        { text: label, italics: true, fontSize: 7, alignment: 'center', margin: [0, 0, 0, 4] },
        { text: `Date: ${this.soaData.date}`, fontSize: 7 },
        { text: `No.: ${this.soaData.soaNo}`, fontSize: 7 },
        { text: `Name: ${this.soaData.name}`, fontSize: 7 },
        { text: `Address: ${this.soaData.address}`, fontSize: 7 },
        { text: 'New ☐ Ren ☐  ECO ☐  CV ☐  MOD ☐  ROC ☐', fontSize: 7, margin: [0, 3, 0, 3] },
        { text: `Particulars: ${this.soaData.particulars}`, fontSize: 7, margin: [0, 0, 0, 3] },
        this.createSoaTable(),
        { text: 'NOTE: To be paid on or before the due date otherwise subject to reassessment.', fontSize: 6, margin: [0, 4, 0, 0] },
        { columns: [{ text: '☐ For Assessment Only', fontSize: 6 }, { text: '☐ Endorsed for Payment', fontSize: 6 }], margin: [0, 4, 0, 0] }
      ]
    };
  }
}
