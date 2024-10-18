const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const doctors = require('./routes/doctors');
const babies = require('./routes/babies');
const follow_up = require('./routes/follow_up');
const appointments = require('./routes/appointments');
const doctorAvailability = require('./routes/doctor_availability');
app.use(cors({ origin: 'http://localhost:3000', }));
app.use(morgan(
  format = "combined",
));
app.use(bodyParser.json());

app.use('/doctor', doctors);
app.use('/baby', babies);
app.use('/follow_up', follow_up);
app.use('/appointments', appointments);
app.use('/doctorAvailability', doctorAvailability);
module.exports = app;