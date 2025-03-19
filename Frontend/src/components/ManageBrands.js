/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editChainId, setEditChainId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showEditBrand, setShowEditBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterGroupId, setFilterGroupId] = useState("");
  const [filterChainId, setFilterChainId] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchChains();
    fetchBrands();
  }, []);

  // Fetch All Groups for dropdown
  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again.");
    }
  };

   // Fetch All Chains
   const fetchChains = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/chains");
      const activeChains = response.data.filter(chain => chain.active !== false);
      setChains(activeChains);
      setTotalChains(activeChains.length);
      console.log("Fetched chains:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching chains:", err);
      setError("Failed to load chains. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Fetch All Brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/brands");
      const activeBrands = response.data.filter(brand => brand.active !== false);
      setBrands(activeBrands);
      setTotalBrands(activeBrands.length);
      console.log("Fetched brands:", response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter brands by group and/or chain
  const filteredBrands = brands.filter(brand => {
    const groupMatch = filterGroupId ? brand.chain.group.groupId.toString() === filterGroupId : true;
    const chainMatch = filterChainId ? brand.chain.chainId.toString() === filterChainId : true;
    return groupMatch && chainMatch;
  });

  // Add a New Brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setError("Brand name cannot be empty");
      return;
    }
    if (!selectedChainId) {
      setError("Please select a company");
      return;
    }

    try {
      const selectedChain = chains.find(c => c.chainId.toString() === selectedChainId);
      
      const response = await axios.post("http://localhost:8080/api/brands", {
        brandName: newBrandName,
        chain: selectedChain
      });

      console.log("Brand Added:", response.data);
      setNewBrandName("");
      setSelectedChainId("");
      setError(null);
      setSuccess("Brand added successfully!");
      setShowAddBrand(false);
      fetchBrands();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding brand:", err.response?.data);
      setError(err.response?.data || "Brand already exists!");
    }
  };

  // Edit an Existing Brand
  const handleEditBrand = async () => {
    if (!editBrandName.trim()) {
      setError("Brand name cannot be empty");
      return;
    }
    if (!editChainId) {
      setError("Please select a company");
      return;
    }

    try {
      const selectedChain = chains.find(c => c.chainId.toString() === editChainId);
      
      const response = await axios.put(`http://localhost:8080/api/brands/${editBrandId}`, {
        brandName: editBrandName,
        chain: selectedChain,
        updatedAt: new Date()
      });
      
      console.log("Update response:", response.data);
      setEditBrandId(null);
      setEditBrandName("");
      setEditChainId("");
      setError(null);
      setSuccess("Brand updated successfully!");
      setShowEditBrand(false);
      fetchBrands();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating brand:", err);
      setError(err.response?.data || "Error updating brand");
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      console.log("Attempting to delete brand with ID:", brandId);
      
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.delete(`http://localhost:8080/api/brands/${brandId}`, config);
      
      console.log("Delete response:", response.data);
      setSuccess("Brand deleted successfully!");
      fetchBrands();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting brand:", err);
      
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this brand.");
      } else {
        setError(`Error deleting brand: ${err.response?.data || err.message}`);
      }
      
      setTimeout(() => setError(null), 5000);
    }
  };

  const initiateEditBrand = (brand) => {
    setEditBrandId(brand.brandId);
    setEditBrandName(brand.brandName);
    setEditChainId(brand.chain.chainId.toString());
    setShowEditBrand(true);
    setShowAddBrand(false);
  };

  const handleCancel = () => {
    setShowAddBrand(false);
    setShowEditBrand(false);
    setError(null);
    setNewBrandName("");
    setSelectedChainId("");
    setEditBrandName("");
    setEditChainId("");
  };

  // Filter chains by selected group
  const filteredChains = filterGroupId 
    ? chains.filter(chain => chain.group.groupId.toString() === filterGroupId)
    : chains;

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Sidebar Component */}
        <Sidebar activePage="Manage Brands" />

        {/* Main Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>Manage Brand Section</h2>
            <p>Create, edit, and manage your brands</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="alert alert-danger">
              {error}
              <button className="close-btn" onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
              <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
            </div>
          )}

          {!showAddBrand && !showEditBrand && (
            <>
              <div className="dashboard-stats">
                {/* Total Groups Card */}
                <div className="stats-card" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
                  <div className="stats-details">
                    <div className="card-title" style={{ color: 'white' }}>Total Groups</div>
                    <div className="card-value">{totalGroups}</div>
                  </div>
                </div>

                {/* Total Chains Card */}
                <div className="stats-card" style={{ backgroundColor: '#f1c40f', color: 'white' }}>
                  <div className="stats-details">
                    <div className="card-title" style={{ color: 'white' }}>Total Chains</div>
                    <div className="card-value">{totalChains}</div>
                  </div>
                </div>

                {/* Total Brands Card */}
                <div className="stats-card" style={{ backgroundColor: '#f1c40f', color: 'white' }}>
                  <div className="stats-details">
                    <div className="card-title" style={{ color: 'white' }}>Total Brands</div>
                    <div className="card-value">{totalBrands}</div>
                  </div>
                </div>
              </div>

              <div className="action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Add Brand Button */}
                <button 
                  className="add-group-btn" 
                  onClick={() => setShowAddBrand(true)}
                  disabled={loading}
                  style={{ backgroundColor: '#27ae60' }}
                >
                  Add Brand
                </button>

                {/* Filter By Group */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div>
                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Filter by Group</label>
                    <select 
                      value={filterGroupId} 
                      onChange={(e) => {
                        setFilterGroupId(e.target.value);
                        setFilterChainId("");  // Reset chain filter when group changes
                      }}
                      style={{ 
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        minWidth: '200px'
                      }}
                    >
                      <option value="">All Groups</option>
                      {groups.map(group => (
                        <option key={group.groupId} value={group.groupId}>
                          {group.groupName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ marginRight: '10px', fontWeight: '500' }}>Filter by Company</label>
                    <select 
                      value={filterChainId} 
                      onChange={(e) => setFilterChainId(e.target.value)}
                      style={{ 
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        minWidth: '200px'
                      }}
                    >
                      <option value="">All Companies</option>
                      {filteredChains.map(chain => (
                        <option key={chain.chainId} value={chain.chainId}>
                          {chain.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Brands Table */}
              <div className="table-container">
                <table className="groups-table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Group Name</th>
                      <th>Company</th>
                      <th>Brand Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="loading-cell">
                          <div className="loading-spinner"></div>
                          <div>Loading brands...</div>
                        </td>
                      </tr>
                    ) : filteredBrands.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                          No brands found. Add a new brand to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredBrands.map((brand, index) => (
                        <tr key={brand.brandId}>
                          <td>{index + 1}</td>
                          <td>{brand.chain.group.groupName}</td>
                          <td>{brand.chain.companyName}</td>
                          <td>{brand.brandName}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => initiateEditBrand(brand)}
                              style={{ 
                                backgroundColor: '#f39c12', 
                                color: 'white', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px'
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteBrand(brand.brandId)}
                              style={{ 
                                backgroundColor: '#e74c3c', 
                                color: 'white', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Add Brand Form */}
          {showAddBrand && (
            <div className="card">
              <div className="card-header">
                <h3>Add New Brand</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="brandName">Enter Brand Name:</label>
                  <input
                    id="brandName"
                    type="text"
                    placeholder="Enter Brand Name"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="selectGroup">Select Group:</label>
                  <select
                    id="selectGroup"
                    value={filterGroupId}
                    onChange={(e) => {
                      setFilterGroupId(e.target.value);
                      setSelectedChainId("");
                    }}
                    className="form-input"
                  >
                    <option value="">Select a group</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="selectChain">Select Company:</label>
                  <select
                    id="selectChain"
                    value={selectedChainId}
                    onChange={(e) => setSelectedChainId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select a company</option>
                    {filteredChains.map(chain => (
                      <option key={chain.chainId} value={chain.chainId}>
                        {chain.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleAddBrand}
                    style={{ backgroundColor: '#3498db' }}
                  >
                    Add Brand
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Brand Form */}
          {showEditBrand && (
            <div className="card">
              <div className="card-header">
                <h3>Edit Brand</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="editBrandName">Enter Brand Name:</label>
                  <input
                    id="editBrandName"
                    type="text"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editSelectGroup">Select Group:</label>
                  <select
                    id="editSelectGroup"
                    value={filterGroupId}
                    onChange={(e) => {
                      setFilterGroupId(e.target.value);
                      setEditChainId("");
                    }}
                    className="form-input"
                  >
                    <option value="">Select a group</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editSelectChain">Select Company:</label>
                  <select
                    id="editSelectChain"
                    value={editChainId}
                    onChange={(e) => setEditChainId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select a company</option>
                    {filteredChains.map(chain => (
                      <option key={chain.chainId} value={chain.chainId}>
                        {chain.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-group">
                  <button 
                    className="submit-btn"
                    onClick={handleEditBrand}
                    style={{ backgroundColor: '#3498db' }}
                  >
                    Update
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBrands;