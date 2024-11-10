const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection details
const connection = mysql.createConnection({
  host: 'localhost', // Database host
  user: 'root', // Database username
  password: 'test123', // Database password
  database: 'ecommerce' // The database where you want to import the dump
});

// SQL dump file path
const sqlDumpPath = path.join(__dirname, './sql_dump.sql'); // Make sure path is correct
const sqlDump = fs.readFileSync(sqlDumpPath, 'utf-8');

// Function to check if the line is a valid SQL query or a comment
const isSQLQuery = (line) => {
  // Check if the line is a comment (starting with -- or #) or empty
  const trimmedLine = line.trim();
  return !(trimmedLine.startsWith('--') || trimmedLine.startsWith('#') || trimmedLine === '');
};

// Split the dump into lines and process each line
const sqlStatements = sqlDump
  .split(/\r?\n/)  // Split on both Unix (\n) and Windows (\r\n) line breaks
  .map(line => line.trim())  // Trim any extra spaces
  .filter(isSQLQuery);  // Keep only lines that are SQL queries
  
// Function to execute each SQL statement
const executeSQL = (statements) => {
  statements.forEach(statement => {
    if (statement) {
        console.log("SQL: -> " + statement);
      connection.query(statement, (err, results) => {
        if (err) {
          console.error('Error executing statement:');
        } else {
          console.log('Executed query successfully:', results);
        }
      });
    }
  });
};

// Connect to the database and execute the SQL statements
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
  executeSQL(sqlStatements);

  // Close the connection after execution
  connection.end();
});
