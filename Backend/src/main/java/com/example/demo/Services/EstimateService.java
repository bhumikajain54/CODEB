package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Estimate;
import com.example.demo.Entity.Chain;
import com.example.demo.Repository.EstimateRepository;
import com.example.demo.Repository.ChainRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EstimateService {

    @Autowired
    private EstimateRepository estimateRepository;

    @Autowired
    private ChainRepository chainRepository;

    // Get all estimates
    public List<Estimate> getAllEstimates() {
        return estimateRepository.findAll();
    }

    // Get estimate by id
    public Optional<Estimate> getEstimateById(Long estimateId) {
        return estimateRepository.findById(estimateId);
    }

    // Get estimates by chain id
    public List<Estimate> getEstimatesByChainId(Long chainId) {
        return estimateRepository.findByChainChainId(chainId);
    }

    // Get estimates by group name
    public List<Estimate> getEstimatesByGroupName(String groupName) {
        return estimateRepository.findByGroupName(groupName);
    }

    // Get estimates by brand name
    public List<Estimate> getEstimatesByBrandName(String brandName) {
        return estimateRepository.findByBrandName(brandName);
    }

    // Get estimates by zone name
    public List<Estimate> getEstimatesByZoneName(String zoneName) {
        return estimateRepository.findByZoneName(zoneName);
    }

    // Create a new estimate
    public Estimate createEstimate(Estimate estimate, Long chainId) {
        // Find the chain
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        // Set the chain and calculate total cost
        estimate.setChain(chain);
        estimate.setTotalCost(estimate.getQuantity() * estimate.getCostPerUnit());
        estimate.setCreatedAt(LocalDateTime.now());
        estimate.setUpdatedAt(LocalDateTime.now());

        return estimateRepository.save(estimate);
    }

    // Update an estimate
    public Estimate updateEstimate(Long estimateId, Estimate updatedEstimate, Long chainId) {
        // Find existing estimate
        Estimate existingEstimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        // Find the chain if chain ID is provided
        if (chainId != null) {
            Chain chain = chainRepository.findById(chainId)
                    .orElseThrow(() -> new RuntimeException("Chain not found"));
            existingEstimate.setChain(chain);
        }

        // Update fields
        existingEstimate.setGroupName(updatedEstimate.getGroupName());
        existingEstimate.setBrandName(updatedEstimate.getBrandName());
        existingEstimate.setZoneName(updatedEstimate.getZoneName());
        existingEstimate.setService(updatedEstimate.getService());
        existingEstimate.setQuantity(updatedEstimate.getQuantity());
        existingEstimate.setCostPerUnit(updatedEstimate.getCostPerUnit());
        existingEstimate.setTotalCost(updatedEstimate.getQuantity() * updatedEstimate.getCostPerUnit());
        existingEstimate.setDeliveryDate(updatedEstimate.getDeliveryDate());
        existingEstimate.setDeliveryDetails(updatedEstimate.getDeliveryDetails());
        existingEstimate.setUpdatedAt(LocalDateTime.now());

        return estimateRepository.save(existingEstimate);
    }

    // Delete an estimate
    public void deleteEstimate(Long estimateId) {
        // Check if estimate exists
        if (!estimateRepository.existsById(estimateId)) {
            throw new RuntimeException("Estimate not found");
        }

        estimateRepository.deleteById(estimateId);
    }

    // Get total estimate count
    public long getEstimateCount() {
        return estimateRepository.count();
    }
}