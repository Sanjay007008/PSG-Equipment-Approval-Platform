import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { formatDate } from '../utils/helpers';
import { StyledTable , StyledTableCell, StyledButton, StyledTableHeader, } from '../utils/styledComponents';
import { fetchPendingApprovals, approveTransaction, rejectTransaction, downloadRequestForm } from '../services/transactionsApi';

export const PendingApprovals = ({ reload,onAction }) => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const getPendingApprovals = async () => {
      try {
        const data = await fetchPendingApprovals();
        setPendingApprovals(data);
      } catch (error) {
        console.error('Error fetching pending approvals:', error);
      }
    };

    getPendingApprovals();
  }, [reload]);

  // const handleAction = (action, transactionId) => {
  //   const token = localStorage.getItem('authToken');
  //   let msg = action;
  //   if (msg === 'download') msg = 'download request form for';
  
  //   const confirmAction = window.confirm(`Are you sure you want to ${msg} this transaction?`);
  //   if (!confirmAction) return;
  
  //   let apiUrl = '';
  //   let successMessage = '';
  //   let errorMessage = '';
  
  //   if (action === 'approve') {
  //     apiUrl = `${API_ENDPOINT}/transaction/approve/${transactionId}`;
  //     successMessage = 'Transaction approved successfully!';
  //     errorMessage = 'Failed to approve the transaction.';
  //     axios.put(apiUrl, {}, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then(response => {
  //       if (response.status === 200) {
  //         alert(successMessage);
  //         onAction(); // refresh or perform any action needed after successful request
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       alert(errorMessage);
  //     });
  //   } else if (action === 'reject') {
  //     apiUrl = `${API_ENDPOINT}/transaction/reject/${transactionId}`;
  //     successMessage = 'Transaction rejected successfully!';
  //     errorMessage = 'Failed to reject the transaction.';
  //     axios.put(apiUrl, {}, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then(response => {
  //       if (response.status === 200) {
  //         alert(successMessage);
  //         onAction(); // refresh or perform any action needed after successful request
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       alert(errorMessage);
  //     });
  //   } else if (action === 'download') {
  //     apiUrl = `${API_ENDPOINT}/request-form/${transactionId}`;
  //     successMessage = 'Request form downloaded successfully!';
  //     errorMessage = 'Failed to download the request form.';
  
  //     axios.get(apiUrl, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       responseType: 'blob', // important for file downloads
  //     })
  //     .then(response => {
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', `request-form-${transactionId}.pdf`); // Adjust file name as needed
  //       document.body.appendChild(link);
  //       link.click();
  //       alert(successMessage);
  //       onAction(); // refresh or perform any action needed after successful request
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       alert(errorMessage);
  //     });
  //   }
  // };  

  const handleApprove = async (transactionId) => {
    const confirmAction = window.confirm("Are you sure you want to approve the transaction?");
    if (!confirmAction) return;
    try {
      const response = await approveTransaction(transactionId);
      if (response.status === 200) {
        alert('Transaction approved successfully!');
        onAction(); // refresh or perform any action needed after successful request
      }
    } catch (error) {
      console.error(error);
      alert('Failed to approve the transaction.');
    }
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

  const handleReject = async (transactionId) => {
    const confirmAction = window.confirm("Are you sure you want to reject the transaction?");
    if (!confirmAction) return;
    try {
      const response = await rejectTransaction(transactionId);
      if (response.status === 200) {
        alert('Transaction rejected successfully!');
        onAction(); // refresh or perform any action needed after successful request
      }
    } catch (error) {
      console.error(error);
      alert('Failed to reject the transaction.');
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
            <StyledTableCell>Reject</StyledTableCell>
            <StyledTableCell>Approve</StyledTableCell>
          </TableRow>
        </StyledTableHeader>
        <TableBody>
          {pendingApprovals.map(row => (
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
              <TableCell>
                <StyledButton variant="contained" color="error" onClick={() => handleReject(row.TransactionID)}>
                  Reject
                </StyledButton>
              </TableCell>
              <TableCell>
                <StyledButton variant="contained" color="success" onClick={() => handleApprove(row.TransactionID)}>
                  Approve
                </StyledButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTable>
  );
};