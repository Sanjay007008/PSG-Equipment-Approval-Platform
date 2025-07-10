import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { formatDate } from '../utils/helpers';
import { downloadRequestForm } from '../services/transactionsApi';
import { StyledTable , StyledTableCell, StyledTableHeader, StyledButton } from '../utils/styledComponents';
import { fetchLiveTransactions } from '../services/transactionsApi';

export const LiveTransactions = ({ reload }) => {
    const [liveTransactions, setLiveTransactions] = useState([]);
  
    useEffect(() => {
      const loadTransactions = async () => {
        try {
          const transactions = await fetchLiveTransactions(); // Use the API function
          setLiveTransactions(transactions);
        } catch (error) {
          console.error('Error fetching live transactions:', error.message);
        }
      };
  
      loadTransactions();
    }, [reload]);

    const handleDownload = async (transactionId) => {
      const confirmAction = window.confirm(`Are you sure you want to download form for this transaction?`);
      if (!confirmAction) return;
      try {
        const blob = await downloadRequestForm(transactionId);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `request-form-${transactionId}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        alert('Failed to download the request form.');
      }
    };
  
    return (
      <StyledTable component={Paper}>
        <Table>
          <StyledTableHeader>
            <TableRow>
              <StyledTableCell>Transaction Id</StyledTableCell>
              <StyledTableCell>Equipment Id</StyledTableCell>
              <StyledTableCell>Person Name</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Approved Date</StyledTableCell>
              <StyledTableCell>Expected Return Days</StyledTableCell>
              <StyledTableCell>Return Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Request Form</StyledTableCell>
            </TableRow>
          </StyledTableHeader>
          <TableBody>
            {liveTransactions.map(row => (
              <TableRow key={row.TransactionID}>
                <TableCell>{row.TransactionID}</TableCell>
                <TableCell>{row.EquipmentID}</TableCell>
                <TableCell>{row.PersonName}</TableCell>
                <TableCell>{row.CompanyName}</TableCell>
                <TableCell>{row.PhoneNumber}</TableCell>
                <TableCell>{formatDate(row.RequestDate)}</TableCell>
                <TableCell>{formatDate(row.ApprovedDate)}</TableCell>
                <TableCell>{row.ExpectedReturnDays}</TableCell>
                <TableCell>{formatDate(row.ReturnDate)}</TableCell>
                <TableCell>{row.Status}</TableCell>
                <TableCell>
                <StyledButton variant="contained" color="primary" onClick={() => handleDownload(row.TransactionID)}>
                  Requisition Letter
                </StyledButton>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTable>
    );
  };