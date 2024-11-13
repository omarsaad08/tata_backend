const { pool } = require('../configs/db_conf');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const appID = 'd3cd34df63c14ee0853c1063429148ae';
const appCertificate = '701256341e5847a68266d640744dd945';
const expirationTimeInSeconds = 3600 * 10000;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
const role = RtcRole.PUBLISHER; // Role (e.g., Publisher, Subscriber)

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


const generateToken = (req, res) => {
  const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
  const { channelName, uid } = req.body;
  // Your Agora App ID and App Certificate
  const appID = 'd3cd34df63c14ee0853c1063429148ae';
  const appCertificate = '701256341e5847a68266d640744dd945';
  const role = RtcRole.PUBLISHER;

  // Set token expiration (1 hour)
  const expirationTimeInSeconds = 3600 * 10;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Generate the token
  const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

  console.log('Generated Token:', token);

  res.json({ token });
};
// for testing
const getAllAppointments = async (req, res) => {
  try {
    const query = 'SELECT * FROM appointments';
    const result = await pool.query(query);
    res.status(200).json(result.rows);

  } catch (e) {
    console.log("error: ", e);
  }
}
const getTodaysAppointments = async (req, res) => {
  const doctorId = parseInt(req.params.id);

  if (isNaN(doctorId)) {
    return res.status(400).json({ error: 'Invalid doctor ID' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM appointments 
        WHERE status = 'approved' 
        AND doctor_id = $1
        AND (appointment_date > CURRENT_DATE)`,
      [doctorId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching today\'s approved appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNextAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * 
      FROM appointments 
      WHERE doctor_id = $1 
      AND (appointment_date > CURRENT_DATE OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME))
      AND status != 'منتهي'
      ORDER BY appointment_date ASC, appointment_time ASC 
      LIMIT 1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(200).json(null);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "error fetching next appointment" });
  }
}
const getNextappointmentForBaby = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * 
      FROM appointments 
      WHERE baby_id = $1 
      AND (appointment_date > CURRENT_DATE OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME))
      AND status != 'منتهي'
      ORDER BY appointment_date ASC, appointment_time ASC 
      LIMIT 1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(200).json(null);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "error fetching next appointment" });
  }
}

const postAppointment = async (req, res) => {
  const { baby_id, doctor_id, appointment_date, appointment_time, type, online, roomid } = req.body;

  try {
    const isAvailable = await checkDoctorAvailability(doctor_id, new Date(appointment_date), appointment_time);
    if (!isAvailable) {
      return res.status(400).json({ message: `الدكتور غير متاح في هذا الوقت` });
    }

    const isConflict = await checkAppointmentConflict(doctor_id, new Date(appointment_date), appointment_time);
    if (!isConflict) {
      return res.status(400).json({ message: 'هذا التوقيت محجوز بالفعل' });
    }
    // getting docotrs and babys data
    const babyData = await pool.query(`SELECT * FROM babies WHERE id = $1 LIMIT 1`, [baby_id]);
    const doctorData = await pool.query(`SELECT * FROM doctors WHERE id = $1 LIMIT 1`, [doctor_id]);
    // generating token
    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, roomid, doctorData.rows[0]['id'], role, privilegeExpiredTs);
    const babyToken = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, roomid, babyData.rows[0]['id'], role, privilegeExpiredTs);
    const query = `INSERT INTO appointments (baby_id, doctor_id, appointment_date, appointment_time, status, type, online, roomid, baby_name, doctor_name, place, token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
    await pool.query(query, [baby_id, doctor_id, appointment_date, appointment_time, 'مطلوب', type, online, roomid, babyData.rows[0]['name'], doctorData.rows[0]['name'], doctorData.rows[0]['address'], token]);
    res.status(200).json({ message: 'تم حجز الجلسة بنجاح' });
  } catch (e) {
    res.status(500).json({ message: 'Database error.' });
    console.error(e);
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params; // Get appointment ID from URL
  const updates = req.body; // Fields to update

  // Array to store the query parts and their values
  const setQueries = [];
  const values = [];

  // Iterate through the keys in the request body and build dynamic query parts
  Object.keys(updates).forEach((field, index) => {
    setQueries.push(`${field} = $${index + 1}`); // Set query string, e.g., 'status = $1'
    values.push(updates[field]); // Corresponding value for the placeholder, e.g., 'confirmed'
  });

  if (setQueries.length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  // Construct the full query
  const queryText = `
    UPDATE appointments 
    SET ${setQueries.join(', ')} 
    WHERE appointment_id = $${setQueries.length + 1} 
    RETURNING *
  `;
  values.push(id); // Add appointment ID as the last parameter

  try {
    const { rows } = await pool.query(queryText, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully', appointment: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the appointment' });
  }

}
const getRequestedAppointments = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const status = req.params.status;
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: 'Invalid doctor ID' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM appointments 
        WHERE status = $2 
        AND doctor_id = $1
        AND (appointment_date > CURRENT_DATE 
            OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME))`,
      [doctorId, status]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming requested appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const fetchPreviousBookingsForBaby = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(typeof id);
    const query = `SELECT * FROM appointments
                    WHERE baby_id = $1
                    AND (appointment_date < CURRENT_DATE
                        OR (appointment_date = CURRENT_DATE AND appointment_time > CURRENT_TIME))`;
    const result = await pool.query(query, [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    }
    else {

      res.status(404).json({ error: "no previous bookings found" });
    }
  } catch (e) {
    res.status(500).json({ error: `server error: ${e}` });
  }
}
module.exports = {
  getAllAppointments,
  getTodaysAppointments,
  getNextAppointment,
  postAppointment,
  getNextappointmentForBaby,
  generateToken,
  updateAppointment,
  getRequestedAppointments,
  fetchPreviousBookingsForBaby
};