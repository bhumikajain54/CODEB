package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Invoice;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PdfService pdfService;

    public void sendInvoiceEmail(Invoice invoice) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(invoice.getEmailId());
            helper.setSubject("Invoice #" + invoice.getInvoiceNo() + " from " + invoice.getChain().getCompanyName());
            helper.setText("Please find attached your invoice for the services provided. Thank you for your business.");

            // Generate the PDF and attach it
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            helper.addAttachment("Invoice_" + invoice.getInvoiceNo() + ".pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with invoice", e);
        }
    }
}