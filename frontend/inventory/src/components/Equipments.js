import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper, TextField, MenuItem, Button, Grid } from '@mui/material';
import { StyledTable , StyledTableCell, StyledTableHeader } from '../utils/styledComponents';
import { fetchEquipments } from '../services/equipmentsApi';

export const Equipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [filteredEquipments, setFilteredEquipments] = useState([]);
  const [filters, setFilters] = useState({
    equipmentId: '',
    equipmentName: '',
    make: '',
    model: '',
    serialNumber: '',
    status: ''
  });
  const [uniqueMakes, setUniqueMakes] = useState([]);

  useEffect(() => {
    // Fetch the equipment data
    const getEquipments = async () => {
      try {
        const data = await fetchEquipments();
        setEquipments(data);
        setFilteredEquipments(data);

        // Get unique "Make" values for the dropdown
        const makes = [...new Set(data.map(item => item.Make))];
        setUniqueMakes(makes);
      } catch (error) {
        console.error('Error fetching equipments:', error);
      }
    };

    getEquipments();
  }, []);

  useEffect(() => {
    // Filter the data based on the filter inputs
    const filtered = equipments.filter(equipment => {
      return (
        equipment.EquipmentID.toString().includes(filters.equipmentId) &&
        equipment.EquipmentName.toLowerCase().includes(filters.equipmentName.toLowerCase()) &&
        (filters.make === '' || equipment.Make === filters.make) &&
        equipment.Model.toLowerCase().includes(filters.model.toLowerCase()) &&
        equipment.SerialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase()) &&
        equipment.Status.toLowerCase().includes(filters.status.toLowerCase())
      );
    });
    setFilteredEquipments(filtered);
  }, [filters, equipments]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      equipmentId: '',
      equipmentName: '',
      make: '',
      model: '',
      serialNumber: '',
      status: ''
    });
  };

  return (
    <div>
      {/* Filters Section - Using Grid Layout */}
      <Grid container spacing={2} style={{ padding: '1em' }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Equipment ID"
            name="equipmentId"
            value={filters.equipmentId}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Equipment Name"
            name="equipmentName"
            value={filters.equipmentName}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Make"
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            variant="outlined"
            select
            fullWidth
          >
            <MenuItem value=""><em>All Makes</em></MenuItem>
            {uniqueMakes.map(make => (
              <MenuItem key={make} value={make}>{make}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Model"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Serial Number"
            name="serialNumber"
            value={filters.serialNumber}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            variant="outlined"
            select
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="REQUESTED">REQUESTED</MenuItem>
            <MenuItem value="ISSUED">ISSUED</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
      <StyledTable component={Paper}>
        <Table>
          <StyledTableHeader>
            <TableRow>
              <StyledTableCell>Equipment ID</StyledTableCell>
              <StyledTableCell>Equipment Name</StyledTableCell>
              <StyledTableCell>Make</StyledTableCell>
              <StyledTableCell>Model</StyledTableCell>
              <StyledTableCell>Serial Number</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {filteredEquipments.map(row => (
              <TableRow key={row.EquipmentID}>
                <TableCell>{row.EquipmentID}</TableCell>
                <TableCell>{row.EquipmentName}</TableCell>
                <TableCell>{row.Make}</TableCell>
                <TableCell>{row.Model}</TableCell>
                <TableCell>{row.SerialNumber}</TableCell>
                <TableCell>{row.Status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTable>
    </div>
  );
};
