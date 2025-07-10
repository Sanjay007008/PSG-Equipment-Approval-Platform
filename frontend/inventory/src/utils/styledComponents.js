import { TableContainer, TableHead, TableCell, Button } from '@mui/material';
import { styled } from '@mui/system';

// Define the color theme to match the previous LogoBar
export const themeColor = 'rgb(55, 81, 126)';

// Styled components
export const StyledTable = styled(TableContainer)({
    margin: '1em',
    maxHeight: '60vh', // Limit the height of the table container to make it scrollable
    overflowY: 'auto',  // Enable vertical scrolling
  });
  
  export const StyledTableHeader = styled(TableHead)({
    backgroundColor: 'rgb(55, 81, 126)',
    position: 'sticky',  // Make the header sticky
    top: 0,              // Stick to the top of the container
    zIndex: 1,           // Ensure the header stays above the table rows
  });
  
  export const StyledTableCell = styled(TableCell)({
    color: 'white',
    fontWeight: 'bold',
  });

  export const StyledButton = styled(Button)({
  marginRight: '0.5em',
});

export const FilterContainer = styled('div')({
  marginBottom: '1em',
  padding: '1em',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
});