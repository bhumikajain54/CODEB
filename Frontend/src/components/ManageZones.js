/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faPlusCircle,
  faEdit,
  faTrashAlt,
  faSave,
  faTimes,
  faSyncAlt,
  faFolderOpen,
  faMapMarkerAlt,
  faCopyright,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";

const ManageZones = () => {
  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [editZoneId, setEditZoneId] = useState(null);
  const [editZoneName, setEditZoneName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalZones, setTotalZones] = useState(0);
  const [showAddZone, setShowAddZone] = useState(false);
  const [showEditZone, setShowEditZone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterBrand, setFilterBrand] = useState("");
  const [filterChain, setFilterChain] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchZones();
    fetchBrands();
    fetchChains();
    fetchGroups();
    fetchZoneCount();
  }, []);

  // Fetch All Zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/zones`);
      setZones(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching zones:", err);
      setError("Failed to load zones. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Zone Count
  const fetchZoneCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/zones/count`);
      setTotalZones(response.data);
    } catch (err) {
      console.error("Error fetching zone count:", err);
    }
  };

  // Fetch All Brands
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  // Fetch All Chains
  const fetchChains = async () => {
    try {
      const response = await axios.get(`${API_URL}/chains`);
      setChains(response.data);
    } catch (err) {
      console.error("Error fetching chains:", err);
    }
  };

  // Fetch All Groups
  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Fetch Zones By Brand
  const fetchZonesByBrand = async (brandId) => {
    if (!brandId) {
      fetchZones();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/zones/brand/${brandId}`);
      setZones(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching zones by brand:", err);
      setError("Failed to load zones. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Zones By Chain
  const fetchZonesByChain = async (chainId) => {
    if (!chainId) {
      fetchZones();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/zones/chain/${chainId}`);
      setZones(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching zones by chain:", err);
      setError("Failed to load zones. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Zones By Group
  const fetchZonesByGroup = async (groupId) => {
    if (!groupId) {
      fetchZones();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/zones/group/${groupId}`);
      setZones(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching zones by group:", err);
      setError("Failed to load zones. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a New Zone
  const handleAddZone = async () => {
    if (!newZoneName.trim()) {
      setError("Zone name cannot be empty.");
      return;
    }

    if (!selectedBrandId) {
      setError("Please select a brand.");
      return;
    }

    try {
      setLoading(true);
      const zoneData = {
        zoneName: newZoneName
      };
      
      const response = await axios.post(
        `${API_URL}/zones?brandId=${selectedBrandId}`, 
        zoneData
      );

      setZones([...zones, response.data]);
      setNewZoneName("");
      setSelectedBrandId("");
      setError(null);
      setSuccess("Zone added successfully!");
      setShowAddZone(false);
      fetchZones();
      fetchZoneCount();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error adding zone:", error);
      setError(error.response?.data?.error || "Zone already exists for this brand!");
    } finally {
      setLoading(false);
    }
  };
  
  // Edit an Existing Zone
  const handleEditZone = async () => {
    if (!editZoneName.trim()) {
      setError("Zone name cannot be empty");
      return;
    }
    
    if (!editBrandId) {
      setError("Please select a brand");
      return;
    }
    
    try {
      setLoading(true);
      const zoneData = {
        zoneName: editZoneName
      };
      
      const response = await axios.put(
        `${API_URL}/zones/${editZoneId}?brandId=${editBrandId}`, 
        zoneData
      );
      
      setEditZoneId(null);
      setEditZoneName("");
      setEditBrandId("");
      setError(null);
      setSuccess("Zone updated successfully!");
      setShowEditZone(false);
      fetchZones();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating zone:", err);
      setError(err.response?.data?.error || "Error updating zone");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Zone
  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
  
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/zones/${zoneId}`);
      
      setSuccess("Zone deleted successfully!");
      fetchZones();
      fetchZoneCount();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting zone:", err);
      setError(err.response?.data?.error || "Error deleting zone");
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initiateEditZone = (zone) => {
    setEditZoneId(zone.zoneId);
    setEditZoneName(zone.zoneName);
    setEditBrandId(zone.brand.brandId);
    setShowEditZone(true);
    setShowAddZone(false);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Apply filters based on selections
  useEffect(() => {
    if (filterBrand) {
      fetchZonesByBrand(filterBrand);
    } else if (filterChain) {
      fetchZonesByChain(filterChain);
    } else if (filterGroup) {
      fetchZonesByGroup(filterGroup);
    } else {
      fetchZones();
    }
  }, [filterBrand, filterChain, filterGroup]);

  // Handle filter changes
  const handleFilterGroupChange = (e) => {
    const groupId = e.target.value;
    setFilterGroup(groupId);
    setFilterChain("");
    setFilterBrand("");
  };

  const handleFilterChainChange = (e) => {
    const chainId = e.target.value;
    setFilterChain(chainId);
    setFilterBrand("");
  };

  const handleFilterBrandChange = (e) => {
    const brandId = e.target.value;
    setFilterBrand(brandId);
  };
  
  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Zones" />

        <div className="content-area">
          <div className="page-header">
            <h1>Zone Management</h1>
            <p>Create, edit, and manage your zones</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-danger">
              <FontAwesomeIcon icon={faExclamationCircle} className="alert-icon" />
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheckCircle} className="alert-icon" />
              <span className="alert-message">{success}</span>
              <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
            </div>
          )}

          {!showAddZone && !showEditZone && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                {/* Total Groups Card */}
                <div className="stats-card groups-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Groups</div>
                    <div className="card-value">{groups.length}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </div>
                </div>
                
                {/* Total Chains Card */}
                <div className="stats-card chains-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Chains</div>
                    <div className="card-value">{chains.length}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                </div>

                {/* Total Brands Card */}
                <div className="stats-card brands-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Brands</div>
                    <div className="card-value">{brands.length}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faCopyright} />
                  </div>
                </div>

                {/* Total Zones Card */}
                <div className="stats-card zones-card">
                  <div className="stats-card-content">
                    <div className="card-title">Total Zones</div>
                    <div className="card-value">{totalZones}</div>
                  </div>
                  <div className="stats-card-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                </div>

                {/* Filter options */}
                <div className="filter-section">
                  <div className="filter-row">
                    <div className="filter-item">
                      <label htmlFor="groupFilter">Filter by Group:</label>
                      <select
                        id="groupFilter"
                        value={filterGroup}
                        onChange={handleFilterGroupChange}
                        className="filter-select"
                      >
                        <option value="">All Groups</option>
                        {groups.map(group => (
                          <option key={group.groupId} value={group.groupId}>
                            {group.groupName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-item">
                      <label htmlFor="chainFilter">Filter by Company:</label>
                      <select
                        id="chainFilter"
                        value={filterChain}
                        onChange={handleFilterChainChange}
                        className="filter-select"
                      >
                        <option value="">All Companies</option>
                        {chains
                          .filter(chain => !filterGroup || (chain.group && chain.group.groupId.toString() === filterGroup))
                          .map(chain => (
                            <option key={chain.chainId} value={chain.chainId}>
                              {chain.companyName || chain.chainName}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="filter-item">
                      <label htmlFor="brandFilter">Filter by Brand:</label>
                      <select
                        id="brandFilter"
                        value={filterBrand}
                        onChange={handleFilterBrandChange}
                        className="filter-select"
                      >
                        <option value="">All Brands</option>
                        {brands
                          .filter(brand => 
                            (!filterChain || (brand.chain && brand.chain.chainId.toString() === filterChain)) &&
                            (!filterGroup || (brand.chain && brand.chain.group && brand.chain.group.groupId.toString() === filterGroup))
                          )
                          .map(brand => (
                            <option key={brand.brandId} value={brand.brandId}>
                              {brand.brandName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add Zone Button */}
                <button 
                  className="add-zone-btn" 
                  onClick={() => {
                    setShowAddZone(true);
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  {loading ? "Loading..." : "Add Zone"}
                </button>
              </div>

              {/* Zones Table */}
              <div className="table-container">
                <table className="zones-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group</th>
                      <th>Company</th>
                      <th>Brand</th>
                      <th>Zone</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <span>Loading zones...</span>
                        </td>
                      </tr>
                    ) : zones.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          <div className="empty-state">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="empty-icon" />
                            <p>No zones found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      zones.map((zone, index) => (
                        <tr key={zone.id}>
                          <td>{index + 1}</td>
                          <td>
                            {zone.brand && zone.brand.chain && zone.brand.chain.group
                              ? zone.brand.chain.group.groupName
                              : "N/A"}
                          </td>
                          <td>
                            {zone.brand && zone.brand.chain
                              ? (zone.brand.chain.companyName || zone.brand.chain.chainName)
                              : "N/A"}
                          </td>
                          <td>{zone.brand ? zone.brand.brandName : "N/A"}</td>
                          <td>{zone.zoneName}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => initiateEditZone(zone)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                          </td>
                          <td>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteZone(zone.id)}
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Zone Form */}
          {showAddZone && (
            <div className="zone-form">
              <h3>Add New Zone</h3>
              <div className="form-group">
                <label htmlFor="zoneName">Enter Zone Name:</label>
                <input
                  id="zoneName"
                  type="text"
                  placeholder="Enter Zone Name"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="brandSelect">Select Brand:</label>
                <select
                  id="brandSelect"
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName} ({brand.chain ? (brand.chain.companyName || brand.chain.chainName) : "N/A"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleAddZone}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      Add Zone
                    </>
                  )}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddZone(false);
                    setNewZoneName("");
                    setSelectedBrandId("");
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Zone Form */}
          {showEditZone && (
            <div className="zone-form">
              <h3>Edit Zone</h3>
              <div className="form-group">
                <label htmlFor="editZoneName">Enter Zone Name:</label>
                <input
                  id="editZoneName"
                  type="text"
                  value={editZoneName}
                  onChange={(e) => setEditZoneName(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editBrandSelect">Select Brand:</label>
                <select
                  id="editBrandSelect"
                  value={editBrandId}
                  onChange={(e) => setEditBrandId(e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName} ({brand.chain ? (brand.chain.companyName || brand.chain.chainName) : "N/A"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button 
                  className="submit-btn"
                  onClick={handleEditZone}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSyncAlt} />
                      Update
                    </>
                  )}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditZone(false);
                    setEditZoneName("");
                    setEditBrandId("");
                    clearMessages();
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageZones;