const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const server = http.createServer(app);
const { pool } = require('./configs/db_conf');

async function startServer() {
  await pool.connect()
    .then(() => { console.log('connected to PostgreSQL database :)'); })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL:', err.stack);
      process.exit(1);
    })
  // await mongoose.connect('dbLink')
  //   .then(() => console.log('MongoDB Connected :)'))
  //   .catch((e) => console.log(`error connecting to mongodb: ${e}`));
  server.listen(PORT, HOST, () => console.log(`port number: ${PORT}`));
}
startServer();