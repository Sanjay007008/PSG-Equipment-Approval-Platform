import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { submitEquipment } from '../services/equipmentsApi';

const NewEquipmentForm = ({ isOpen, togglePopup }) => {
  const [formData, setFormData] = useState({
    EquipmentName: '',
    Make: '',
    Model: '',
    SerialNumber: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Equipment Name validation
    if (formData.EquipmentName.length < 2) {
      newErrors.EquipmentName = 'Equipment Name must be filled.';
    }

    // Make validation
    if (formData.Make.length < 2) {
      newErrors.Make = 'Make must be filled.';
    }

    // Model validation
    if (formData.Model.length < 2) {
      newErrors.Model = 'Model must be filled.';
    }

    // Serial Number validation
    if (!/^[a-zA-Z0-9-]+$/.test(formData.SerialNumber) || formData.SerialNumber.length < 2) {
      newErrors.SerialNumber = 'Serial Number must be alphanumeric and filled.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    if (validateForm()) {
      try {
        const response = await submitEquipment(formData); // Use the API function
        console.log('Form submitted successfully:', response);
        alert('Form submitted successfully');
        togglePopup(); // Close the popup after submission
      } catch (error) {
        console.error('Error submitting the form:', error.message);
        alert('Error submitting the form');
      }
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={togglePopup} maxWidth="sm" fullWidth>
        <DialogTitle>NEW EQUIPMENT REGISTRATION</DialogTitle>
        <DialogContent style={{ maxHeight: '400px', overflow: 'auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '1vh' }}>
            <TextField
              label="Equipment Name"
              name="EquipmentName"
              value={formData.EquipmentName}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter Equipment Name"
              error={!!errors.EquipmentName}
              helperText={errors.EquipmentName}
            />
            <TextField
              label="Make"
              name="Make"
              value={formData.Make}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter Make"
              error={!!errors.Make}
              helperText={errors.Make}
            />
            <TextField
              label="Model"
              name="Model"
              value={formData.Model}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter Model"
              error={!!errors.Model}
              helperText={errors.Model}
            />
            <TextField
              label="Serial Number"
              name="SerialNumber"
              value={formData.SerialNumber}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter Serial Number"
              error={!!errors.SerialNumber}
              helperText={errors.SerialNumber}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={togglePopup} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewEquipmentForm;
