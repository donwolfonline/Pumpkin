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

        // Manual download to ensure filename and extension are honored
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
