import { Component } from '@angular/core';
import { SoaService, Soa, SoaSection } from '../services/soa.service';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// fonts
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-soa-pdf',
  standalone: true,
  template: `
    <div class="container">
      <button class="generate-btn" (click)="generatePDF()">
        Generate SOA PDF
      </button>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center; 
      align-items: center;     
      height: 98vh;          
      width: 98vw;            
      background-color: #FEFAF6; 
    }

    .generate-btn {
      background-color: #305973;
      color: white;
      border: none;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .generate-btn:hover {
      background-color: #59AC77;
    }

    .generate-btn:active {
      transform: scale(0.98);
    }
  `]
})
export class SoaPdfComponent {
  soaData!: Soa;

  constructor(private soaService: SoaService) { }

  generatePDF(): void {
    this.soaService.getSoaDetails().subscribe(data => {
      this.soaData = data;

      const docDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [8, 8, 8, 8],
        content: [
          {
            columns: [
              this.soaColumn('Servicing Unit Copy'),
              this.soaColumn('Accounting Unit Copy'),
              this.soaColumn('COA Copy'),
              this.soaColumn('Cash Unit Copy')
            ],
            columnGap: 4
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
        body.push([
          '',
          row[0],
          {
            text: row[1].toLocaleString('en-US', { minimumFractionDigits: 2 }),
            alignment: 'right'
          }
        ]);
      });
    });

    const totalAmount = this.soaData.sections
      .flatMap(sec => sec.rows)
      .reduce((sum, r) => sum + r[1], 0);

    body.push([
      { text: 'TOTAL AMOUNT', colSpan: 2, bold: true, alignment: 'right' },
      {},
      {
        text: totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        bold: true,
        alignment: 'right'
      }
    ]);

    return {
      table: { widths: [18, '*', 48], body },
      fontSize: 6.8,
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        paddingLeft: () => 3,
        paddingRight: () => 3,
        paddingTop: () => 1.8,
        paddingBottom: () => 1.8
      }
    };
  }

  soaColumn(label: string): any {
    return {
      width: '25%',
      stack: [
        { text: 'NATIONAL TELECOMMUNICATIONS COMMISSION', bold: true, fontSize: 7.8, alignment: 'center' },
        { text: 'Statement of Account', fontSize: 7, alignment: 'center' },

        { text: label, italics: true, fontSize: 6.8, alignment: 'center', margin: [0, 0, 0, 3] },

        { text: `Date        : ${this.soaData.date}`, fontSize: 6.8 },
        { text: `No.          : ${this.soaData.soaNo}`, fontSize: 6.8 },
        { text: `Name     : ${this.soaData.name}`, fontSize: 6.8 },
        { text: `Address : ${this.soaData.address}`, fontSize: 6.8 },

        {
          columns: [
            this.checkBox(), { text: 'New', fontSize: 6 },
            this.checkBox(), { text: 'Ren', fontSize: 6 },
            this.checkBox(), { text: 'ECO', fontSize: 6 },
            this.checkBox(), { text: 'CV', fontSize: 6 },
            this.checkBox(), { text: 'MOD', fontSize: 6 },
            this.checkBox(), { text: 'ROC', fontSize: 6 },
          ],
          columnGap: 6,
          margin: [0, 2, 0, 2]
        },

        {
          columns: [
            { text: 'Particulars:', fontSize: 6.8, width: 34 },
            {
              canvas: [
                {
                  type: 'rect',
                  x: 0,
                  y: 0,
                  w: 150,
                  h: 10,
                  lineWidth: 0.6
                }
              ]
            }
          ],
          columnGap: 4,
          margin: [0, 0, 0, 2]
        },

        this.createSoaTable(),

        { text: 'NOTE: To be paid on or before the due date otherwise subject to reassessment.', fontSize: 6, margin: [0, 3, 0, 0] },

        {
          columns: [
            { columns: [this.checkBox(), { text: 'For Assessment Only', fontSize: 6 }], columnGap: 4 },
            { columns: [this.checkBox(), { text: 'Endorsed for Payment', fontSize: 6 }], columnGap: 4 }
          ],
          margin: [0, 3, 0, 0]
        },

        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'PREPARED BY:', bold: true, fontSize: 6.5, margin: [0, 3, 0, 1] },
                { text: 'Engr. Ryan J. dela Cruz', bold: true, fontSize: 6.5, margin: [0, 7.9, 0, 0] },
                { text: 'Administrative Division', fontSize: 6, margin: [0, 0, 0, 0] },
                { text: 'Over Printed Name & Signature', italics: true, fontSize: 5.5 }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'APPROVED BY:', bold: true, fontSize: 6.5, margin: [0, 3, 0, 1] },
                { text: 'Engr. Gerald Villoso', bold: true, fontSize: 6.5, margin: [0, 7.9, 0, 0] },
                { text: 'Administrative Division', fontSize: 6, margin: [0, 0, 0, 0] },
                { text: 'Over Printed Name & Signature', italics: true, fontSize: 5.5 }
              ]
            }
          ],
          columnGap: 6,
          margin: [0, 3, 0, 0]
        }
      ]
    };
  }

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
