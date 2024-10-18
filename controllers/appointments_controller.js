const { pool } = require('../configs/db_conf');

function getWeekdayFromDate(date) {
  const day = new Date(date).getDay(); // JS getDay: 0=Sunday, 6=Saturday
  return day === 0 ? 7 : day; // Map JS Sunday (0) to 7 for your database
}

const checkDoctorAvailability = async (doctor_id, appointment_date, appointment_time) => {
  try {
    const weekday = getWeekdayFromDate(appointment_date); // Calculate weekday
    const result = await pool.query(
      `SELECT * FROM doctor_availability 
        WHERE doctor_id = $1 
        AND weekday = $2 
        AND start_time <= $3 
        AND end_time >= $3`,
      [doctor_id, weekday, appointment_time]
    );

    if (result.rows.length > 0) {
      return true;
    } else {
      return false; // Doctor not available
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    throw new Error("Database error");
  }
};

async function checkAppointmentConflict(doctor_id, appointment_date, appointment_time) {
  const result = await pool.query(
    `SELECT * FROM Appointments WHERE doctor_id = $1 
      AND appointment_date = $2 AND appointment_time = $3`,
    [doctor_id, appointment_date, appointment_time]
  );
  return result.rowCount === 0;
}


const getTodaysAppointments = (req, res) => {
  const { id } = request.params;
  try {
    const query = `SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = CURRENT_DATE`;
    const result = pool.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `server error: $e` });
  }
};

const getNextAppointment = (req, res) => {
  const { id } = request.params;
  try {
    const query = `SELECT * FROM appointments WHERE doctor_id = $1 AND (appointment_date > CURRENT_DATE) OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME) ORDER BY appointment_date, appointment_time LIMIT 1`;
    const result = pool.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `internal server error` });
  }
}

const getNextappointmentForBaby = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM appointments WHERE patient_id = :patient_id AND (appointment_date > CURRENT_DATE OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME)) ORDER BY appointment_date ASC, appointment_time ASC LIMIT 1;`;
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(200).json(null);
    }
  } catch (e) {
    res.status(500).json({ error: "error fetching next appointment" });
  }
}

const postAppointment = async (req, res) => {
  const { baby_id, doctor_id, appointment_date, appointment_time } = req.body;

  try {
    const isAvailable = await checkDoctorAvailability(doctor_id, new Date(appointment_date), appointment_time);
    if (!isAvailable) {
      return res.status(400).json({ error: `الدكتور غير متاح في هذا الوقت` });
    }

    const isConflict = await checkAppointmentConflict(doctor_id, new Date(appointment_date), appointment_time);
    if (!isConflict) {
      return res.status(400).json({ error: 'هذا التوقيت محجوز بالفعل' });
    }

    const query = `INSERT INTO appointments (baby_id, doctor_id, appointment_date, appointment_time) VALUES ($1, $2, $3, $4)`;
    await pool.query(query, [baby_id, doctor_id, appointment_date, appointment_time]);
    res.status(200).json({ message: 'تم حجز الجلسة بنجاح' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error.' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const query = `UPDATE appointments SET baby_id = $1, doctor_id = $2, appointment_date = $3, appointment_time = $4, updated_at = CURRENT_TIMESTAMP WHERE appointment_id = $5 RETURNING *`;
    const result = pool.query(query, [baby_id, doctor_id, appointment_date, appointment_time, appointment_id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}
module.exports = {
  getTodaysAppointments,
  getNextAppointment,
  postAppointment,
};