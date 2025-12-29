import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const generatePDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Element not found');
    }

    try {
        const dataUrl = await toPng(element, {
            quality: 1,
            backgroundColor: '#ffffff',
            width: 800,
            height: 1100,
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
            },
            cacheBust: true,
        });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
