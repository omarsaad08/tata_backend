const { pool } = require('../configs/db_conf');

module.exports = {
  checkDoctorAvailability,
  checkAppointmentConflict
}