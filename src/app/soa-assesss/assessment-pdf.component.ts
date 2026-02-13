import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-assessment-pdf',
  standalone: true,
  imports: [CommonModule],  // ✅ keep CommonModule for ngIf, ngFor, etc.
  templateUrl: './assessment-pdf.component.html',
  styleUrls: ['./assessment-pdf.component.css'],
})
export class AssessmentPdfComponent {
  @ViewChild('printArea', { static: true })
  printArea!: ElementRef<HTMLElement>;

  // -----------------------------
  // Export PDF method
  // -----------------------------
  exportPDF(): void {
    const el = this.printArea?.nativeElement;
    if (!el) return alert('printArea not found');

    // Open popup for preview
    const win = window.open('', '_blank');
    if (!win) return alert('Popup blocked. Allow popups for this site.');

    // Save original styles
    const oldStyles = {
      width: el.style.width,
      height: el.style.height,
      overflow: el.style.overflow,
      background: el.style.background,
    };

    // Temporarily set element size for PDF capture
    el.style.width = '1123px';  // Approx A4 landscape
    el.style.height = '794px';
    el.style.overflow = 'hidden';
    el.style.background = '#fff';

    // Wait one frame to ensure styles applied
    requestAnimationFrame(async () => {
      try {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        } as any);

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);

        // Generate blob URL for preview
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);

        win.document.open();
        win.document.write(`
          <html>
            <head>
              <title>Assessment PDF Preview</title>
              <style>html, body { margin:0; height:100%; }</style>
            </head>
            <body>
              <iframe src="${url}" style="border:0;width:100%;height:100%;"></iframe>
            </body>
          </html>
        `);
        win.document.close();

        // Revoke blob URL after 1 minute to free memory
        setTimeout(() => URL.revokeObjectURL(url), 60_000);

      } catch (err) {
        console.error('PDF export failed:', err);
        win.document.open();
        win.document.write('<p style="color:red;padding:12px;">Export failed. Check console for details.</p>');
        win.document.close();
      } finally {
        // Restore original element styles
        el.style.width = oldStyles.width;
        el.style.height = oldStyles.height;
        el.style.overflow = oldStyles.overflow;
        el.style.background = oldStyles.background;
      }
    });
  }
}
