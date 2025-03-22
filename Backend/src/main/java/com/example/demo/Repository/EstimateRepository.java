package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Estimate;
import com.example.demo.Entity.Chain;

import java.util.List;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {
    List<Estimate> findByChain(Chain chain);
    List<Estimate> findByChainChainId(Long chainId);
    List<Estimate> findByGroupName(String groupName);
    List<Estimate> findByBrandName(String brandName);
    List<Estimate> findByZoneName(String zoneName);
    long count();
}