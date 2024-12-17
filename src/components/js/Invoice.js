import jsPDF from 'jspdf';
import 'jspdf-autotable';
import fontkit from '@pdf-lib/fontkit';
import img1 from '../images/logo.png'; // Ensure this path is correct
import '../css/Invoice.css'
const Invoice = {
    generate: (invoiceData) => {
        const doc = new jsPDF();
        doc.setFont('helvetica');

        // Add logo
        const img = new Image();
        img.src = img1;
        doc.addImage(img, 'PNG', 10, 10, 30, 30); // Adjusted size

        // Add date and invoice number
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 139);
        doc.text(`Invoice No: ${invoiceData.invoiceNumber}`, 105, 20, null, null, 'center');
        doc.text(`Date: ${invoiceData.date}`, 200, 20, null, null, 'right');

        // Add supplier and customer information
        doc.setFontSize(12);
        doc.setFillColor(255, 246, 209);
        doc.rect(10, 50, 190, 50, 'F'); // Increased height for better spacing

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text('Whipp n Dipp', 15, 60); // Adjusted Y position for centering text
        doc.setFontSize(10);
        doc.text('Contact Number: 123-456-7890', 15, 70);
        doc.text('Email: contact@whippndipp.com', 15, 80); // Added email
        doc.text('Address: 123 Ice Cream St., Sweet City, SC', 15, 90);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black text color
        doc.text('Customer Information', 120, 60); // Adjusted Y position for centering text
        doc.text(`Name: ${invoiceData.customerName}`, 120, 70);
        doc.text(`Contact: ${invoiceData.customerContact}`, 120, 80);
        doc.text(`Address: ${invoiceData.customerAddress}`, 120, 90);

        // Add items table
        const tableColumn = ["Sr No.", "Product details", "Price", "Qty.", "Subtotal"];
        const tableRows = [];

        invoiceData.items.forEach((item, index) => {
            const itemData = [
                index + 1,
                item.selectedFlavour,
                `₹${Number(item.price).toFixed(2)}`,
                item.quantity,
                `₹${Number(item.amount).toFixed(2)}`,
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 110, // Adjusted startY for better placement
            theme: 'grid',
            headStyles: { fillColor: [173, 216, 230] }, // Light blue header
            margin: { left: 10, right: 10 }, // Centering the table horizontally
            styles: {
                overflow: 'linebreak',
                fontSize: 10,
                cellPadding: 5,
                halign: 'center',
                valign: 'middle',
                textColor: [50, 50, 50] // Dark grey text color
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 70 },
                2: { cellWidth: 30 },
                3: { cellWidth: 20 },
                4: { cellWidth: 30 },
            },
        });

        // Add total amount below the table, aligned below "Qty."
        const finalY = doc.autoTable.previous.finalY;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Black text color
        doc.text(`Total: ₹${Number(invoiceData.totalAmount).toFixed(2)}`, 150, finalY + 10); // Adjusted position

        // Add thank you note
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100); // Light grey text color
        doc.setFillColor(255, 255, 224); // Light yellow background
        doc.rect(10, finalY + 20, 190, 20, 'F'); // Rectangle for thank you note background
        doc.text("Thank you for ordering. Visit us again!", 105, finalY + 28, null, null, 'center');

        // Save PDF
        doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
    }
};

export default Invoice;
