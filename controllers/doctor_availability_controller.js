const { pool } = require('../configs/db_conf');

const getAllDoctorAvailability = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM doctor_availability`);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `Database Error` });
  }
}

const getDoctorsAvailabilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM doctor_availability WHERE $doctor_id = $1`;
    const result = await pool.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `database error` });
  }
};

// testing
const doctorWeekAvailability = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    // Get doctor's availability
    const availabilityResult = await pool.query(
      `SELECT *
        FROM doctor_availability
        WHERE doctor_id = $1`,
      [doctor_id]
    );

    // Get already booked appointments
    const bookedAppointmentsResult = await pool.query(
      `SELECT appointment_date, appointment_time
        FROM appointments
        WHERE doctor_id = $1`,
      [doctor_id]
    );

    // Send both availability and booked appointments
    res.status(200).json({
      availability: availabilityResult.rows,
      bookedAppointments: bookedAppointmentsResult.rows
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
}

const postDoctorAvailability = async (req, res) => {
  const availabilityData = req.body; // Expecting an array of availability objects

  try {
    // Insert each availability into the database
    for (const availability of availabilityData) {
      const { doctor_id, weekday, start_time, end_time, online, offline } = availability;

      await pool.query(
        'INSERT INTO doctor_availability (doctor_id, weekday, start_time, end_time, online, offline) VALUES ($1, $2, $3, $4, $5, $6)',
        [doctor_id, weekday, start_time, end_time, online, offline]
      );
    }

    res.status(200).json({ message: 'Availability saved successfully!' });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Failed to save availability' });
  }
}

const updateDoctorAvailability = async (req, res) => {

}

const deleteDoctorAvailability = async (req, res) => {

}

module.exports = {
  getAllDoctorAvailability,
  getDoctorsAvailabilityById,
  postDoctorAvailability,
  updateDoctorAvailability,
  deleteDoctorAvailability,
  doctorWeekAvailability
}