package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Estimate;
import com.example.demo.Services.EstimateService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estimates")
@CrossOrigin(origins = "*")
public class EstimateController {

    @Autowired
    private EstimateService estimateService;

    @GetMapping
    public List<Estimate> getAllEstimates() {
        return estimateService.getAllEstimates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEstimateById(@PathVariable Long id) {
        return estimateService.getEstimateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/chain/{chainId}")
    public List<Estimate> getEstimatesByChainId(@PathVariable Long chainId) {
        return estimateService.getEstimatesByChainId(chainId);
    }

    @GetMapping("/group/{groupName}")
    public List<Estimate> getEstimatesByGroupName(@PathVariable String groupName) {
        return estimateService.getEstimatesByGroupName(groupName);
    }

    @GetMapping("/brand/{brandName}")
    public List<Estimate> getEstimatesByBrandName(@PathVariable String brandName) {
        return estimateService.getEstimatesByBrandName(brandName);
    }

    @GetMapping("/zone/{zoneName}")
    public List<Estimate> getEstimatesByZoneName(@PathVariable String zoneName) {
        return estimateService.getEstimatesByZoneName(zoneName);
    }

    @PostMapping
    public ResponseEntity<?> createEstimate(@RequestBody Estimate estimate, @RequestParam Long chainId) {
        try {
            Estimate newEstimate = estimateService.createEstimate(estimate, chainId);
            return ResponseEntity.ok(newEstimate);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEstimate(@PathVariable Long id, @RequestBody Estimate estimate,
                                            @RequestParam(required = false) Long chainId) {
        try {
            Estimate updatedEstimate = estimateService.updateEstimate(id, estimate, chainId);
            return ResponseEntity.ok(updatedEstimate);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstimate(@PathVariable Long id) {
        try {
            estimateService.deleteEstimate(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Estimate deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getEstimateCount() {
        return ResponseEntity.ok(estimateService.getEstimateCount());
    }
}