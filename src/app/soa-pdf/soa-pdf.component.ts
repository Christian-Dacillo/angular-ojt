import { Component } from '@angular/core';
import { SoaService, Soa, SoaSection } from '../services/soa.service';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// fonts
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({  
  selector: 'app-soa-pdf',
  standalone: true,
  template: `<button (click)="generatePDF()">Generate SOA PDF</button>`
})
export class SoaPdfComponent {
  soaData!: Soa; // Variable to hold the SOA data retrieved from the service
      
  constructor(private soaService: SoaService) { } // Inject SOA service

  // MAIN:
  generatePDF(): void {
    // Fetch SOA details from the service
    this.soaService.getSoaDetails().subscribe(data => {
      this.soaData = data; // Store the data locally

      const docDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 10, 10, 10],
        content: [
          {
            // Four columns for different SOA copies
            columns: [
              this.soaColumn('Servicing Unit Copy'),
              this.soaColumn('Accounting Unit Copy'),
              this.soaColumn('COA Copy'),
              this.soaColumn('Cash Unit Copy')
            ],
            columnGap: 5
          }
        ]
      };

      pdfMake.createPdf(docDefinition).open(); // Open the generated PDF
    });
  }

  // FUNCTION: SOA Table
  createSoaTable(): any {
    const body: any[] = [
      [
        { text: 'CODE', bold: true },
        { text: 'PARTICULARS', bold: true },
        { text: 'TOTAL', bold: true, alignment: 'right' }
      ]
    ];

    // Loop through sections of the SOA
    this.soaData.sections.forEach((section: SoaSection) => {
      body.push([{ text: section.title, colSpan: 3, bold: true }, {}, {}]);
      section.rows.forEach(row => {
        body.push(['', row[0], { text: row[1].toFixed(2), alignment: 'right' }]);
      });
    });

    // Calculate total amount
    const totalAmount = this.soaData.sections
      .flatMap(sec => sec.rows)
      .reduce((sum, r) => sum + r[1], 0);

    // Add total row
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

  // FUNCTION: Create one SOA column
  soaColumn(label: string): any {
    return {
      width: '25%',
      stack: [
        { text: 'NATIONAL TELECOMMUNICATIONS COMMISSION', bold: true, fontSize: 8, alignment: 'center' },
        { text: 'Statement of Account', fontSize: 7, alignment: 'center' },

        { text: label, italics: true, fontSize: 7, alignment: 'center', margin: [0, 0, 0, 4] },

        { text: `Date        : ${this.soaData.date}`, fontSize: 7 },
        { text: `No.          : ${this.soaData.soaNo}`, fontSize: 7 },
        { text: `Name     : ${this.soaData.name}`, fontSize: 7 },
        { text: `Address : ${this.soaData.address}`, fontSize: 7 },

        // CHECKBOXES (fixed – no Unicode)
        {
          columns: [
            this.checkBox(), { text: 'New', fontSize: 6 },
            this.checkBox(), { text: 'Ren', fontSize: 6 },
            this.checkBox(), { text: 'ECO', fontSize: 6 },
            this.checkBox(), { text: 'CV', fontSize: 6 }, 
            this.checkBox(), { text: 'MOD', fontSize: 6 }, 
            this.checkBox(), { text: 'ROC', fontSize: 6 }, 
          ],
          columnGap: 7,
          margin: [0, 3, 0, 3]
        },

        { text: `Particulars: ${this.soaData.particulars}`, fontSize: 7, margin: [0, 0, 0, 3] },

        this.createSoaTable(),

        { text: 'NOTE: To be paid on or before the due date otherwise subject to reassessment.', fontSize: 6, margin: [0, 4, 0, 0] },

        {
          columns: [
            { columns: [this.checkBox(), { text: 'For Assessment Only', fontSize: 6 }], columnGap: 5 },
            { columns: [this.checkBox(), { text: 'Endorsed for Payment', fontSize: 6 }], columnGap: 5 }
          ],
          margin: [0, 4, 0, 0]
        }
      ]
    };
  }

  // FUNCTION: Draw checkbox (pdfMake-safe)
  checkBox(): any {
    return {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 6,
          h: 6,
          lineWidth: 0.7
        }
      ],
      width: 4,
      height: 8
    };
  }
}
