import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export const generatePDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        // 1. Sanitize filename (alphanumeric and dashes only)
        const safeBaseName = filename
            .replace(/\.pdf$/i, '')
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            || 'invoice';

        const finalFilename = `${safeBaseName.toLowerCase()}.pdf`;

        // 2. Capture (pixelRatio: 1 for small size)
        const imgDataUrl = await toPng(element, {
            pixelRatio: 1,
            backgroundColor: '#ffffff',
            width: 800,
            height: 1100,
        });

        // 3. Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // 4. Add Image
        pdf.addImage(imgDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

        // 5. Generate Blob
        const pdfBlob = pdf.output('blob');

        // 6. Wrap in File object (helps browsers respect filename)
        const pdfFile = new File([pdfBlob], finalFilename, { type: 'application/pdf' });

        // 7. Save using FileSaver with the File object
        saveAs(pdfFile);

    } catch (error) {
        console.error('PDF_GENERATION_ERROR:', error);
        throw error;
    }
};
