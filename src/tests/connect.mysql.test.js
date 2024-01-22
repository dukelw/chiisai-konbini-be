const mysql = require("mysql2");

console.time("TIME RUNNING:::");
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "lewis",
  database: "test",
  port: "8811", // need to provide port if mapping port is different from 3306
});

const batchSize = 100000;
const totalSize = 10000000;

let currentID = 1;
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentID <= totalSize; i++) {
    const name = `name-${currentID}`;
    const age = currentID;
    const address = `address-${currentID}`;
    values.push([currentID, name, age, address]);
    currentID++;
  }

  if (!values.length) {
    console.timeEnd("TIME RUNNING:::");
    pool.end((err) => {
      if (err) {
        console.log(`Error occurred while closing poll connection`);
      } else {
        console.log(`Connection pool closed successfully`);
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) values ?`;

  pool.query(sql, [values], async (err, result) => {
    if (err) throw err;
    console.log(`Inserted ${result.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
