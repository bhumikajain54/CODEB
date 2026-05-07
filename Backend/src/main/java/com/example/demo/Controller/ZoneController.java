package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import com.example.demo.Entity.Zone;
import com.example.demo.Services.ZoneService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @GetMapping
    public List<Zone> getAllZones() {
        return zoneService.getAllZones();
    }

    @GetMapping("/brand/{brandId}")
    public List<Zone> getZonesByBrand(@PathVariable @NonNull Long brandId) {
        return zoneService.getZonesByBrand(brandId);
    }

    @GetMapping("/chain/{chainId}")
    public List<Zone> getZonesByChain(@PathVariable @NonNull Long chainId) {
        return zoneService.getZonesByChain(chainId);
    }

    @GetMapping("/group/{groupId}")
    public List<Zone> getZonesByGroup(@PathVariable @NonNull Long groupId) {
        return zoneService.getZonesByGroup(groupId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getZoneById(@PathVariable @NonNull Long id) {
        return zoneService.getZoneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createZone(@RequestBody Zone zone, @RequestParam @NonNull Long brandId) {
        try {
            Zone newZone = zoneService.addZone(zone, brandId);
            return ResponseEntity.ok(newZone);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateZone(@PathVariable @NonNull Long id, @RequestBody Zone zone, @RequestParam @NonNull Long brandId) {
        try {
            Zone updatedZone = zoneService.updateZone(id, zone, brandId);
            return ResponseEntity.ok(updatedZone);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteZone(@PathVariable @NonNull Long id) {
        try {
            zoneService.deleteZone(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Zone deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getZoneCount() {
        return ResponseEntity.ok(zoneService.getZoneCount());
    }
}