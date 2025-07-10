import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper, TextField, MenuItem, Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { downloadRequestForm } from '../services/transactionsApi';
import {formatDate} from '../utils/helpers';
import { StyledTable , StyledTableCell, StyledButton, StyledTableHeader, FilterContainer } from '../utils/styledComponents';
import { fetchTransactions } from '../services/transactionsApi';

export const Records = () => {
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [filters, setFilters] = useState({
    equipmentId: '',
    personName: '',
    companyName: '',
    phoneNumber: '',
    requestDateRange: [null, null],
    approvedDateRange: [null, null],
    expectedReturnDays: '',
    returnDateRange: [null, null],
    status: '',
  });

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setLiveTransactions(data);
      } catch (error) {
        console.error('Error fetching live transactions:', error);
      }
    };
  
    getTransactions();
  }, []);  

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      equipmentId: '',
      personName: '',
      companyName: '',
      phoneNumber: '',
      requestDateRange: [null, null],
      approvedDateRange: [null, null],
      expectedReturnDays: '',
      returnDateRange: [null, null],
      status: '',
    });
  };

  const filterRecords = (transaction) => {
    return (
      (filters.equipmentId === '' || transaction.EquipmentID === Number(filters.equipmentId)) &&
      (filters.personName === '' || transaction.PersonName.toLowerCase().includes(filters.personName.toLowerCase())) &&
      (filters.companyName === '' || transaction.CompanyName.toLowerCase().includes(filters.companyName.toLowerCase())) &&
      (filters.phoneNumber === '' || transaction.PhoneNumber.includes(filters.phoneNumber)) &&
      (filters.expectedReturnDays === '' || transaction.ExpectedReturnDays === Number(filters.expectedReturnDays)) &&
      (filters.status === '' || transaction.Status.includes(filters.status)) &&
      (filters.requestDateRange[0] === null || new Date(transaction.RequestDate) >= filters.requestDateRange[0]) &&
      (filters.requestDateRange[1] === null || new Date(transaction.RequestDate) <= filters.requestDateRange[1]) &&
      (filters.approvedDateRange[0] === null || new Date(transaction.ApprovedDate) >= filters.approvedDateRange[0]) &&
      (filters.approvedDateRange[1] === null || new Date(transaction.ApprovedDate) <= filters.approvedDateRange[1]) &&
      (filters.returnDateRange[0] === null || new Date(transaction.ReturnDate) >= filters.returnDateRange[0]) &&
      (filters.returnDateRange[1] === null || new Date(transaction.ReturnDate) <= filters.returnDateRange[1])
    );
  };

  const handleDownload = async (transactionId) => {
    const confirmAction = window.confirm("Are you sure you want to download form for this transaction?");
    if (!confirmAction) return;
    try {
      const blob = await downloadRequestForm(transactionId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Requisition-letter-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Failed to download the request form.');
    }
  };

  return (
    <>
      <FilterContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Equipment ID"
              value={filters.equipmentId}
              onChange={(e) => handleFilterChange('equipmentId', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Person Name"
              value={filters.personName}
              onChange={(e) => handleFilterChange('personName', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Company Name"
              value={filters.companyName}
              onChange={(e) => handleFilterChange('companyName', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Phone Number"
              value={filters.phoneNumber}
              onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Expected Return Days"
              value={filters.expectedReturnDays}
              onChange={(e) => handleFilterChange('expectedReturnDays', e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              variant="outlined"
              size="small"
              select
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="REQUESTED">REQUESTED</MenuItem>
              <MenuItem value="FACULTY_APPROVED">FACULTY_APPROVED</MenuItem>
              <MenuItem value="DEAN_IRD_APPROVED">DEAN_IRD_APPROVED</MenuItem>
              <MenuItem value="DEAN_ADMIN_APPROVED">DEAN_ADMIN_APPROVED</MenuItem>
              <MenuItem value="ISSUED">ISSUED</MenuItem>
              <MenuItem value="RETURN_REQUESTED">RETURN_REQUESTED</MenuItem>
              <MenuItem value="RETURN_FACULTY_APPROVED">RETURN_FACULTY_APPROVED</MenuItem>
              <MenuItem value="RETURNED">RETURNED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Request Date Start"
                value={filters.requestDateRange[0]}
                onChange={(date) => handleFilterChange('requestDateRange', [date, filters.requestDateRange[1]])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Approved Date Start"
                value={filters.approvedDateRange[0]}
                onChange={(date) => handleFilterChange('approvedDateRange', [date, filters.approvedDateRange[1]])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Return Date Start"
                value={filters.returnDateRange[0]}
                onChange={(date) => handleFilterChange('returnDateRange', [date, filters.returnDateRange[1]])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Request Date End"
                value={filters.requestDateRange[1]}
                onChange={(date) => handleFilterChange('requestDateRange', [filters.requestDateRange[0], date])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Approved Date End"
                value={filters.approvedDateRange[1]}
                onChange={(date) => handleFilterChange('approvedDateRange', [filters.approvedDateRange[0], date])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Return Date End"
                value={filters.returnDateRange[1]}
                onChange={(date) => handleFilterChange('returnDateRange', [filters.returnDateRange[0], date])}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <StyledButton variant="contained" color="primary" onClick={clearFilters}>
              Clear Filters
            </StyledButton>
          </Grid>
        </Grid>
      </FilterContainer>

      <StyledTable component={Paper}>
        <Table>
          <StyledTableHeader>
            <TableRow>
              <StyledTableCell>Transaction ID</StyledTableCell>
              <StyledTableCell>Equipment ID</StyledTableCell>
              <StyledTableCell>Person Name</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Approved Date</StyledTableCell>
              <StyledTableCell>Expected Return Days</StyledTableCell>
              <StyledTableCell>Return Date</StyledTableCell>
              <StyledTableCell>Request Form</StyledTableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {liveTransactions.filter(filterRecords).map((transaction) => (
              <TableRow key={transaction.TransactionID}>
                <TableCell>{transaction.TransactionID}</TableCell>
                <TableCell>{transaction.EquipmentID}</TableCell>
                <TableCell>{transaction.PersonName}</TableCell>
                <TableCell>{transaction.CompanyName}</TableCell>
                <TableCell>{transaction.PhoneNumber}</TableCell>
                <TableCell>{transaction.Status}</TableCell>
                <TableCell>{formatDate(transaction.RequestDate)}</TableCell>
                <TableCell>{formatDate(transaction.ApprovedDate)}</TableCell>
                <TableCell>{transaction.ExpectedReturnDays}</TableCell>
                <TableCell>{formatDate(transaction.ReturnDate)}</TableCell>
                <TableCell>
                <StyledButton variant="contained" color="primary" onClick={() => handleDownload(transaction.TransactionID)}>
                  Requisition Letter
                </StyledButton>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTable>
    </>
  );
};