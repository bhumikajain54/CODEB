package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Invoice;
import com.example.demo.Services.InvoiceService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id)
                .<ResponseEntity<Object>>map(invoice -> ResponseEntity.ok().body(invoice)) // Return Invoice if found
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Invoice not found with id: " + id)) // Return error response
                );
    }


    @GetMapping("/search")
    public ResponseEntity<List<Invoice>> searchInvoices(@RequestParam(required = false) String term) {
        List<Invoice> invoices;
        if (term != null) {
            invoices = invoiceService.searchInvoices(term);
        } else {
            invoices = invoiceService.getAllInvoices(); // or return empty list
        }
        return ResponseEntity.ok(invoices);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateInvoice(@RequestBody Map<String, Object> requestData) {
        try {
            Long estimateId = Long.valueOf(requestData.get("estimateId").toString());
            String emailId = requestData.get("emailId").toString();
            Float amountPaid = Float.valueOf(requestData.get("amountPaid").toString());

            Invoice generatedInvoice = invoiceService.generateInvoice(estimateId, emailId, amountPaid);
            return ResponseEntity.status(HttpStatus.CREATED).body(generatedInvoice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {  // Changed to @RequestBody
        try {
            String emailId = request.get("emailId");
            Invoice updatedInvoice = invoiceService.updateInvoice(id, emailId);
            return ResponseEntity.ok(updatedInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok(Map.of("message", "Invoice deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long id) {
        try {
            byte[] pdfContent = invoiceService.generateInvoicePdf(id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "invoice_" + id + ".pdf");
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}