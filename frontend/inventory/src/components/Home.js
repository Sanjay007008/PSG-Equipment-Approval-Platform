import React, { useState } from 'react';
import { Box } from '@mui/material';
import { PendingApprovals } from './PendingApprovals';
import { LiveTransactions } from './LiveTransactions';

const Home = () => {
  const [reload, setReload] = useState(false);

  const handleAction = () => {
    setReload(!reload);
  };

  return (
    <Box>
      <PendingApprovals reload={reload} onAction={handleAction} />
      <LiveTransactions reload={reload}/>
    </Box>
  );
};

export default Home;