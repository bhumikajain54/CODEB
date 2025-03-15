package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Group;
import com.example.demo.Repository.GroupRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }

    public Group addGroup(Group group) {
        if (groupRepository.findByGroupName(group.getGroupName()).isPresent()) {
            throw new RuntimeException("Group name must be unique.");
        }
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        return groupRepository.save(group);
    }

    public Group updateGroup(Long groupId, String newName) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        if (groupRepository.findByGroupName(newName).isPresent()) {
            throw new RuntimeException("Group name already exists.");
        }
        
        group.setGroupName(newName);
        group.setUpdatedAt(LocalDateTime.now());
        return groupRepository.save(group);
    }

    public void softDeleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setActive(false);
        groupRepository.save(group);
    }
}
