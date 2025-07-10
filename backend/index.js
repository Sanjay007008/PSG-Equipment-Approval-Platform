const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

console.log(process.env.DATABASE_PASSWORD);

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',      // Replace with your MySQL host
    user: process.env.DATABASE_USERNAME,           // Replace with your MySQL username
    password: process.env.DATABASE_PASSWORD,           // Replace with your MySQL password
    database: process.env.DATABASE_NAME, // Replace with your database name
    timezone: 'Z'
});


// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Secret key for JWT
const jwtSecret = process.env.JWT_SECRET;

// Login route - authenticate user and generate JWT
app.post('/login', (req, res) => {
    const { email } = req.body;

    // Find user by email in the database
    db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const user = results[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        // Create JWT payload
        const payload = { email: user.Email, role: user.AccessRole, fullName: user.FullName };

        // Sign JWT token
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    });
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader); // Debug

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        console.error('JWT Error:', err); // Debug
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware for role-based access control
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
        }
    };
};


// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the folder to store the files

app.post('/transaction', authenticateJWT, upload.single('pdfFile'), (req, res) => {
  const { EquipmentID, PersonName, CompanyName, PhoneNumber, ExpectedReturnDays } = req.body;
  const Status = 'REQUESTED';

  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  // Insert transaction into database
  const insertTransactionQuery = `
    INSERT INTO Transactions (EquipmentID, PersonName, CompanyName, PhoneNumber, Status, RequestDate, ExpectedReturnDays) 
    VALUES (?, ?, ?, ?, ?, CURDATE(), ?)
  `;

  db.query(
    insertTransactionQuery,
    [EquipmentID, PersonName, CompanyName, PhoneNumber, Status, ExpectedReturnDays],
    (error, result) => {
      if (error) {
        console.error('Error inserting the transaction:', error);
        return res.status(500).json({ error: 'Database insert failed' });
      }

      const TransactionID = result.insertId; // Get the generated TransactionID

      // Rename the uploaded file to match the TransactionID
      if (req.file) {
        const newFileName = `${TransactionID}${path.extname(req.file.originalname)}`;
        const newPath = path.join(__dirname, 'uploads', newFileName);

        fs.rename(req.file.path, newPath, (err) => {
          if (err) {
            console.error('Error renaming the file:', err);
            return res.status(500).json({ error: 'File rename failed' });
          }

          // Update the RequestForm field in the database with the new file name
          const updateFileNameQuery = `
            UPDATE Transactions SET RequestForm = ? WHERE TransactionID = ?
          `;

          db.query(updateFileNameQuery, [newFileName, TransactionID], (updateError) => {
            if (updateError) {
              console.error('Error updating the RequestForm:', updateError);
              return res.status(500).json({ error: 'Database update failed' });
            }

            // Update Equipment table to set Status = 'required'
            const updateEquipmentQuery = `
              UPDATE Equipment SET Status = 'REQUESTED' WHERE EquipmentID = ?
            `;

            db.query(updateEquipmentQuery, [EquipmentID], (equipmentError) => {
              if (equipmentError) {
                console.error('Error updating the equipment status:', equipmentError);
                return res.status(500).json({ error: 'Failed to update equipment status' });
              }

              res.status(201).json({ message: 'Transaction created successfully', TransactionID });
            });
          });
        });
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    }
  );
});

// API to download the request form associated with a provided TransactionID
app.get('/request-form/:id', (req, res) => {
  const transactionId = parseInt(req.params.id, 10);

  if (isNaN(transactionId)) {
    return res.status(400).json({ error: 'Invalid TransactionID' });
  }

  // Query to get the RequestForm file name
  const query = 'SELECT RequestForm FROM Transactions WHERE TransactionID = ?';

  db.query(query, [transactionId], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const fileName = results[0].RequestForm;

    if (!fileName) {
      return res.status(404).json({ error: 'Request form not available for this transaction' });
    }

    const filePath = path.join(__dirname, 'uploads', fileName);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File not found:', err);
        return res.status(404).json({ error: 'File not found' });
      }

      // Send the file to the client
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Failed to send file' });
        }
      });
    });
  });
});

// API endpoint to retrieve all transaction data
app.get('/transactions', (req, res) => {
    const query = 'SELECT * FROM Transactions';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving transactions:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(results);
    });
});

// API to fetch all transactions whose status is not "ISSUED" or "RETURNED"
app.get('/transactions/live', (req, res) => {
  const query = `
    SELECT * 
    FROM Transactions 
    WHERE Status NOT IN ('ISSUED', 'RETURNED')
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json(results);
  });
});

// API to retrieve pending transactions based on user role
app.get('/transactions/pending-approval', authenticateJWT, (req, res) => {
  
  // Define the status associated with each role
  const roleStatusMap = {
    STAFF: ['ISSUED'],
    FACULTY: ['REQUESTED','RETURN_REQUESTED'],
    DEAN_IRD: ['FACULTY_APPROVED','RETURN_FACULTY_APPROVED'],
    DEAN_ADMIN: ['DEAN_IRD_APPROVED'],
    PRINCIPAL: ['DEAN_ADMIN_APPROVED'],
  };

  const userRole = req.user.role;
  const allowedStatuses = roleStatusMap[userRole] || [];

  if (allowedStatuses.length === 0) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to view any transactions.' });
  }

  // Create a dynamic query to fetch the transactions
  const query = `
      SELECT * FROM Transactions
      WHERE Status IN (?)
  `;

  db.query(query, [allowedStatuses], (err, results) => {
      if (err) {
          console.error('Error fetching transactions:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      res.json({ transactions: results });
  });
});

// API to approve transaction 
app.put('/transaction/approve/:id', authenticateJWT, (req, res) => {

  // Define status transitions for each role
  const statusTransitions = {
    'STAFF': {
        'ISSUED': 'RETURN_REQUESTED'
    },
    'FACULTY': {
        'REQUESTED': 'FACULTY_APPROVED',
        'RETURN_REQUESTED': 'RETURN_FACULTY_APPROVED'
    },
    'DEAN_IRD': {
        'FACULTY_APPROVED': 'DEAN_IRD_APPROVED',
        'RETURN_FACULTY_APPROVED': 'RETURNED'
    },
    'DEAN_ADMIN': {
        'DEAN_IRD_APPROVED': 'DEAN_ADMIN_APPROVED'
    },
    'PRINCIPAL': {
        'DEAN_ADMIN_APPROVED': 'ISSUED'
    },
  };

  const { id } = req.params;

  // Check the current status of the transaction in the database
  const checkStatusQuery = 'SELECT Status FROM Transactions WHERE TransactionID = ?';
  db.query(checkStatusQuery, [id], (err, results) => {
      if (err) {
          console.error('Error fetching transaction:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Transaction not found' });
      }

      const currentStatus = results[0].Status;

      // Check if the user role has valid status transitions
      const allowedTransitions = statusTransitions[req.user.role];
      if (!allowedTransitions || !allowedTransitions[currentStatus]) {
          return res.status(403).json({ message: 'Forbidden: No valid transitions for this role' });
      }

      // Select the new status from the allowed transitions
      const newStatus = allowedTransitions[currentStatus];
      let updateStatusQuery;
      let updateValues = [newStatus, id];

      // Conditionally update ApprovedDate or ReturnDate
      if (req.user.role === 'PRINCIPAL' && newStatus === 'ISSUED') {
          updateStatusQuery = 'UPDATE Transactions SET Status = ?, ApprovedDate = CURDATE() WHERE TransactionID = ?';
      } else if (req.user.role === 'DEAN_IRD' && newStatus === 'RETURNED') {
          updateStatusQuery = 'UPDATE Transactions SET Status = ?, ReturnDate = CURDATE() WHERE TransactionID = ?';
      } else {
          updateStatusQuery = 'UPDATE Transactions SET Status = ? WHERE TransactionID = ?';
      }

      // Update the status in the database
      db.query(updateStatusQuery, updateValues, (err) => {
          if (err) {
              console.error('Error updating status:', err);
              return res.status(500).json({ message: 'Internal server error' });
          }

          res.json({ message: `Status updated to ${newStatus} successfully` });
      });
  });
});

app.put('/transaction/reject/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  // Query to retrieve the EquipmentID associated with the transaction
  const getEquipmentQuery = `
    SELECT EquipmentID 
    FROM Transactions 
    WHERE TransactionID = ?
  `;

  // Execute query to get EquipmentID
  db.query(getEquipmentQuery, [id], (getError, getResults) => {
    if (getError) {
      console.error('Error retrieving equipment ID:', getError);
      return res.status(500).json({ error: 'Failed to retrieve equipment information' });
    }

    if (getResults.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const equipmentId = getResults[0].EquipmentID;

    // Query to reject the transaction
    const rejectTransactionQuery = `
      UPDATE Transactions 
      SET Status = 'REJECTED' 
      WHERE TransactionID = ?
    `;

    // Execute query to reject the transaction
    db.query(rejectTransactionQuery, [id], (updateError, updateResults) => {
      if (updateError) {
        console.error('Database update error:', updateError);
        return res.status(500).json({ error: 'Failed to update transaction status' });
      }

      // Query to update the Equipment status to 'AVAILABLE'
      const updateEquipmentQuery = `
        UPDATE Equipment 
        SET Status = 'AVAILABLE' 
        WHERE EquipmentID = ?
      `;

      // Execute query to update equipment status
      db.query(updateEquipmentQuery, [equipmentId], (equipError, equipResults) => {
        if (equipError) {
          console.error('Error updating equipment status:', equipError);
          return res.status(500).json({ error: 'Failed to update equipment status' });
        }

        // Send success response
        res.json({ 
          message: `Transaction ${id} has been rejected and Equipment ${equipmentId} is now available`, 
          updateResults, 
          equipResults 
        });
      });
    });
  });
});

//API endpoint to retrieve the entire Equipment table
app.get('/equipments', (req, res) => {
  const query = 'SELECT * FROM Equipment';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('An error occurred while retrieving the data');
          return;
      }

      res.json(results);
  });
});

// API endpoint to retrieve Equipment with Status 'AVAILABLE'
app.get('/equipments/available', (req, res) => {
  const query = 'SELECT * FROM Equipment WHERE Status = ?';
  const status = 'AVAILABLE';

  db.query(query, [status], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('An error occurred while retrieving the data');
          return;
      }
      res.json(results);
  });
});


// API endpoint to add new equipment
app.post('/equipment', (req, res) => {
  const { EquipmentName, Make, Model, SerialNumber } = req.body;

  const Status='AVAILABLE';

  // Validate request body
  if (!EquipmentName || !Make || !Model || !SerialNumber || !Status) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  // SQL query to insert new equipment
  const query = `
      INSERT INTO Equipment (EquipmentName, Make, Model, SerialNumber, Status)
      VALUES (?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(query, [EquipmentName, Make, Model, SerialNumber, Status], (err, result) => {
      if (err) {
          console.error('Error inserting equipment:', err.stack);
          return res.status(500).json({ message: 'Failed to add equipment.' });
      }

      res.status(201).json({ message: 'Equipment added successfully.', equipmentId: result.insertId });
  });
});

// Delete equipment endpoint
app.delete('/equipment/:equipment_id', (req, res) => {
    const equipmentId = req.params.equipment_id;
  
    // SQL query to delete equipment by equipment_id
    const query = 'DELETE FROM Equipment WHERE EquipmentID = ?';
  
    db.query(query, [equipmentId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'An error occurred while deleting the equipment.' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Equipment not found.' });
      }
  
      res.status(200).json({ message: 'Equipment deleted successfully.' });
    });
  });

//API endpoint to retrieve users
app.get('/users', (req, res) => {
    const query = 'SELECT Email, AccessRole, FullName FROM Users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('An error occurred while retrieving the data');
            return;
        }
  
        res.json(results);
    });
});

// API endpoint to add a new user
app.post('/user', (req, res) => {
    const { Email, role, name } = req.body;
  
    // Validate required fields
    if (!Email || !role || !name) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // SQL query to insert the new user
    const query = 'INSERT INTO Users (Email, AccessRole, FullName) VALUES (?, ?, ?)';

    db.query(query, [Email, role, name], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'User with this email already exists.' });
        }
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'An error occurred while adding the user.' });
      }

      res.status(201).json({ message: 'User added successfully.' });
    });
});

// Delete user endpoint
app.delete('/user/:email', (req, res) => {
  const email = req.params.email;

  // SQL query to delete user by email
  const query = 'DELETE FROM users WHERE Email = ?';

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  });
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Server Date:', new Date());
});
