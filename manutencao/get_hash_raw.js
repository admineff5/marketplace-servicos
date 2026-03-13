const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://usrdbsite:RPmD0pUdUFnMFWu5xQmkRgSRZHNidkF3K7l@localhost:5434/dbsite"
  });

  try {
    await client.connect();
    const res = await client.query("SELECT password FROM \"User\" WHERE email = 'rodrigoamac@gmail.com'");
    if (res.rows.length > 0) {
      console.log('--- HASH START ---');
      console.log(res.rows[0].password);
      console.log('--- HASH END ---');
    } else {
      console.log('NOT FOUND');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
