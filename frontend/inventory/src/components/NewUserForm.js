import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem
} from '@mui/material';
import { addUser } from '../services/usersApi';

const roles = [
  'STAFF',
  'FACULTY',
  'DEAN_IRD',
  'DEAN_ADMIN',
  'PRINCIPAL'
];

const NewUserForm = ({ isOpen, togglePopup }) => {
  const [formData, setFormData] = useState({
    Email: '',
    name: '',
    role: '',
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

    // Email validation
    if (!/^[\w-]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.Email)) {
      newErrors.Email = 'Invalid Gmail ID.';
    }

    // Name validation
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    // Role selection validation
    if (!formData.role) {
      newErrors.role = 'Please select a role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    if (validateForm()) {
      try {
        // Call the API from the service
        const data = await addUser(formData);
        console.log('Form submitted successfully:', data);

        // Handle successful form submission
        togglePopup(); // Close the popup after submission

        alert(data.message);
      } catch (error) {
        console.error('Error submitting the form:', error);
        alert(error.error);
      }
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={togglePopup} maxWidth="sm" fullWidth>
        <DialogTitle>NEW USER REGISTRATION</DialogTitle>
        <DialogContent style={{ maxHeight: '400px', overflow: 'auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '1vh' }}>
            <TextField
              label="Gmail ID"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter your Gmail ID"
              error={!!errors.Email}
              helperText={errors.Email}
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter your Name"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="outlined"
              select
              fullWidth
              displayEmpty
              placeholder="Select Role"
              error={!!errors.role}
              helperText={errors.role}
            >
              <MenuItem value="" disabled>Select Role</MenuItem>
              {roles.map((role, index) => (
                <MenuItem key={index} value={role}>{role}</MenuItem>
              ))}
            </TextField>
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

export default NewUserForm;
