import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { submitTransaction } from '../services/transactionsApi';
import { fetchAvailableEquipment } from '../services/equipmentsApi';

export const NewRequestForm = ({ isOpen, togglePopup }) => {
  const [formData, setFormData] = useState({
    personName: '',
    companyName: '',
    phoneNumber: '',
    expectedDays: '',
    equipment: '',
    equipmentID: '',
    pdfFile: null,
    pdfFileName: '',
  });
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [allEquipment, setAllEquipment] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const equipmentData = await fetchAvailableEquipment(); // Call the API service function
      setAllEquipment(equipmentData); // Store all equipment
      setFilteredEquipment(equipmentData); // Set initial filtered list
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }
    setFormData({ ...formData, pdfFile: file, pdfFileName: file.name });
    if (errors.pdfFile) {
      setErrors({ ...errors, pdfFile: '' });
    }
  };

  const handleEquipmentSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filteredList = allEquipment.filter((equipment) =>
      equipment.EquipmentName.toLowerCase().includes(searchQuery)
    );
    setFilteredEquipment(filteredList);
    setShowDropdown(true); // Show dropdown when user types
    setFormData({ ...formData, equipment: e.target.value, equipmentID: '' });
  };

  const handleSelectEquipment = (equipment) => {
    setFormData({
      ...formData,
      equipment: equipment.EquipmentName,
      equipmentID: equipment.EquipmentID,
    });
    setShowDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (formData.personName.length < 2) {
      newErrors.personName = 'Person Name must be filled.';
    }
    if (formData.companyName.length < 2) {
      newErrors.companyName = 'Company Name must be filled.';
    }
  
    // Ensure valid equipment is selected
    if (!formData.equipmentID) {
      newErrors.equipment = 'Please select a valid equipment from the list.';
    }
  
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits and numeric.';
    }
    if (formData.expectedDays <= 0 || isNaN(formData.expectedDays)) {
      newErrors.expectedDays = 'Expected days must be a valid positive number.';
    }
    if (!formData.pdfFile) {
      newErrors.pdfFile = 'File is compulsory. Please select a PDF file.';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataForPost = new FormData();
      formDataForPost.append('PersonName', formData.personName);
      formDataForPost.append('CompanyName', formData.companyName);
      formDataForPost.append('PhoneNumber', formData.phoneNumber);
      formDataForPost.append('ExpectedReturnDays', formData.expectedDays);
      formDataForPost.append('Equipment', formData.equipment);
      formDataForPost.append('EquipmentID', formData.equipmentID);

      if (formData.pdfFile) {
        formDataForPost.append('pdfFile', formData.pdfFile);
      }

      try {
        await submitTransaction(formDataForPost); // Call the API service function
        togglePopup(); // Close the popup after submission
        fetchEquipment(); // Re-fetch equipment after submission
        alert('Request Successful');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Request Unsuccessful');
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={togglePopup} maxWidth="sm" fullWidth>
      <DialogTitle>New Equipment Request</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <TextField
            label="Person Name"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            error={!!errors.personName}
            helperText={errors.personName}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Expected Return Days"
            name="expectedDays"
            type="number"
            value={formData.expectedDays}
            onChange={handleChange}
            error={!!errors.expectedDays}
            helperText={errors.expectedDays}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Search Equipment"
            value={formData.equipment}
            onChange={handleEquipmentSearch}
            error={!!errors.equipment}
            helperText={errors.equipment}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            margin="dense"
          />
          {showDropdown && filteredEquipment.length > 0 && (
            <List>
              {filteredEquipment.map((equipment) => (
                <ListItem
                  button
                  key={equipment.EquipmentID}
                  onClick={() => handleSelectEquipment(equipment)}
                >
                  {equipment.EquipmentName}
                </ListItem>
              ))}
            </List>
          )}
          <Button variant="contained" component="label" fullWidth>
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {formData.pdfFileName && (
            <p>{`Selected file: ${formData.pdfFileName}`}</p>
          )}
          {errors.pdfFile && (
            <p style={{ color: 'red' }}>{errors.pdfFile}</p>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={togglePopup} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
