package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Invoice;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByInvoiceNoContainingIgnoreCase(String invoiceNo);
    List<Invoice> findByEstimateEstimateId(Long estimateId);
    List<Invoice> findByChainChainId(Long chainId);
    List<Invoice> findByChainCompanyNameContainingIgnoreCase(String companyName);
}