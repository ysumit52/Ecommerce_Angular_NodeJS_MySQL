const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// MySQL connection configuration (to check if database exists)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your database user
  password: 'test123', // Replace with your database password
});

// SQL dump file path
const sqlDumpPath = path.join(__dirname, './sql_dump.sql'); // Make sure path is correct
const sqlDump = fs.readFileSync(sqlDumpPath, 'utf-8');

// Name of the database you want to ensure exists
const databaseName = "ecommerce";

// Function to create the database if it does not exist
const createDatabaseIfNotExists = () => {
  return new Promise((resolve, reject) => {
    // Check if the database exists
    connection.query(`SHOW DATABASES LIKE '${databaseName}'`, (err, results) => {
      if (err) {
        reject('Error checking database existence:', err);
        return;
      }
      if (results.length === 0) {
        // Database does not exist, create it
        connection.query(`CREATE DATABASE ${databaseName}`, (createErr) => {
          if (createErr) {
            reject('Error creating database:', createErr);
          } else {
            console.log(`Database ${databaseName} created successfully.`);
            resolve();
          }
        });
      } else {
        console.log(`Database ${databaseName} already exists.`);
        resolve();
      }
    });
  });
};

// Connect to the database and run the SQL dump
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err);
    return;
  }
  console.log('Connected to the MySQL server.');

  // Step 1: Ensure the database exists
  createDatabaseIfNotExists()
    .then(() => {
      // Switch to the correct database after ensuring it exists
      connection.query(`USE ${databaseName}`, (useErr) => {
        if (useErr) {
          console.error('Error switching to database:', useErr);
          return;
        }

        // Step 2: Run each SQL statement from the dump file
        const queries = sqlDump.split(';').filter(query => query.trim()); // Split and filter non-empty statements

        queries.forEach((query, index) => {
          connection.query(query, (error, results) => {
            console.log("query-> " + query);
            if (error) {
              console.error(`Error executing query #${index + 1}:`);
            } else {
              console.log(`Query #${index + 1} executed successfully.`);
            }
          });
        });

        // Close the connection
        connection.end(() => {
          console.log('Database connection closed.');
        });
      });
    })
    .catch((error) => {
      console.error('Error creating or checking database:', error);
      connection.end();
    });
});
