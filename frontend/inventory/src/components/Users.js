import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { StyledTable , StyledTableCell, StyledTableHeader } from '../utils/styledComponents';
import { fetchUsers } from '../services/usersApi';

export const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (error) {
        console.error('C Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  return (
    <StyledTable component={Paper}>
      <Table>
        <StyledTableHeader>
          <TableRow>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Access Role</StyledTableCell>
          </TableRow>
        </StyledTableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.Email}>
              <TableCell>{user.FullName}</TableCell>
              <TableCell>{user.Email}</TableCell>
              <TableCell>{user.AccessRole}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTable>
  );
};
