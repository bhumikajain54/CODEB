package com.example.demo.Services;

import com.example.demo.Entity.Invoice;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public static byte[] generateInvoicePdf(Invoice invoice) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add company logo/header
            addHeader(document, invoice);

            // Add invoice details
            addInvoiceDetails(document, invoice);

            // Add service details
            addServiceDetails(document, invoice);

            // Add payment details
            addPaymentDetails(document, invoice);

            // Add footer
            addFooter(document, invoice);

            document.close();
            return out.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF invoice", e);
        }
    }

    private static void addHeader(Document document, Invoice invoice) throws DocumentException {
        Paragraph header = new Paragraph("INVOICE", new Font(Font.HELVETICA, 24, Font.BOLD));
        header.setAlignment(Element.ALIGN_CENTER);
        header.setSpacingAfter(20);
        document.add(header);

        // Company details from Chain
        Paragraph company = new Paragraph();
        company.add(new Chunk(invoice.getChain().getCompanyName() + "\n", new Font(Font.HELVETICA, 14, Font.BOLD)));
        company.add("GSTN: " + invoice.getChain().getGstnNo() + "\n");
        company.setSpacingAfter(20);
        document.add(company);
    }

    private static void addInvoiceDetails(Document document, Invoice invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        // Invoice number and date
        table.addCell(createCell("Invoice Number:", true));
        table.addCell(createCell(invoice.getInvoiceNo(), false));

        table.addCell(createCell("Invoice Date:", true));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        table.addCell(createCell(invoice.getDateOfPayment().format(formatter), false));

        table.addCell(createCell("Estimate ID:", true));
        table.addCell(createCell(invoice.getEstimate().toString(), false));

        document.add(table);

        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingAfter(20);
        document.add(spacer);
    }

    private static void addServiceDetails(Document document, Invoice invoice) throws DocumentException {
        Paragraph serviceHeader = new Paragraph("Service Details", new Font(Font.HELVETICA, 14, Font.BOLD));
        serviceHeader.setSpacingAfter(10);
        document.add(serviceHeader);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        // Add header row
        table.addCell(createCell("Service", true));
        table.addCell(createCell("Quantity", true));
        table.addCell(createCell("Cost per Unit", true));
        table.addCell(createCell("Total", true));

        // Add data row
        table.addCell(createCell(invoice.getServiceDetails(), false));
        table.addCell(createCell(invoice.getQty().toString(), false));
        table.addCell(createCell("₹" + invoice.getCostPerQty().toString(), false));
        table.addCell(createCell("₹" + String.format("%.2f", (invoice.getQty() * invoice.getCostPerQty())), false));

        document.add(table);

        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingAfter(20);
        document.add(spacer);
    }

    private static void addPaymentDetails(Document document, Invoice invoice) throws DocumentException {
        Paragraph paymentHeader = new Paragraph("Payment Details", new Font(Font.HELVETICA, 14, Font.BOLD));
        paymentHeader.setSpacingAfter(10);
        document.add(paymentHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 1});

        // Total amount
        table.addCell(createCell("Total Amount:", true));
        table.addCell(createCell("₹" + String.format("%.2f", (invoice.getQty() * invoice.getCostPerQty())), false));

        // Amount Paid
        table.addCell(createCell("Amount Paid:", true));
        table.addCell(createCell("₹" + invoice.getAmountPayable().toString(), false));

        // Balance (if any)
        if (invoice.getBalance() != null && invoice.getBalance() > 0) {
            table.addCell(createCell("Balance Due:", true));
            table.addCell(createCell("₹" + invoice.getBalance().toString(), false));
        }

        document.add(table);

        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingAfter(20);
        document.add(spacer);
    }

    private static void addFooter(Document document, Invoice invoice) throws DocumentException {
        Paragraph deliveryHeader = new Paragraph("Delivery Information", new Font(Font.HELVETICA, 14, Font.BOLD));
        deliveryHeader.setSpacingAfter(10);
        document.add(deliveryHeader);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        // Delivery date
        table.addCell(createCell("Delivery Date:", true));
        table.addCell(createCell(invoice.getDateOfService().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), false));

        // Delivery details
        table.addCell(createCell("Delivery Details:", true));
        table.addCell(createCell(invoice.getDeliveryDetails(), false));

        document.add(table);

        // Thank you note
        Paragraph thankYou = new Paragraph("Thank you for your business!", new Font(Font.HELVETICA, 12, Font.ITALIC));
        thankYou.setSpacingBefore(40);
        thankYou.setAlignment(Element.ALIGN_CENTER);
        document.add(thankYou);
    }

    private static PdfPCell createCell(String content, boolean isHeader) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(5);

        Font font = isHeader
                ? new Font(Font.HELVETICA, 12, Font.BOLD)
                : new Font(Font.HELVETICA, 12);

        cell.setPhrase(new Phrase(content, font));

        if (isHeader) {
            cell.setBackgroundColor(new Color(220, 220, 220));
        }

        return cell;
    }
}