const { pool } = require('../configs/db_conf');

const getAllDoctors = async (req, res) => {
  try {
    const query = `SELECT * FROM doctors`;
    const result = await pool.query(query);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'no doctors found' });
    res.status(200).json(result.rows);
  } catch (e) {
    console.error('error fetching doctors: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM doctors WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'doctor not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error fetching doctor: ', e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const getDoctorByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const query = `SELECT * FROM doctors WHERE email = $1`;
    const result = await pool.query(query, [email]);
    if (result.rows.length == 0) {
      return res.status(400).json({ error: "there is no doctor with this email" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error fetching doctor: ', e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const postDoctor = async (req, res) => {
  try {
    const { name, email, phone, country, city, address, speciality, sessionsType, experience } = req.body;
    const query = `INSERT INTO doctors (name, email, phone, country, city, address, speciality, sessionsType, experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const result = await pool.query(query, [name, email, phone, country, city, address, speciality, sessionsType, experience]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    // handle unique constraint errors (email & phone)
    if (e.code === '23505')
      return res.status(400).json({ error: 'email or phone number already exists' });
    console.error(e);
    res.status(500).json({ error: `server error: ${e}` });

  }
}

const updateDoctor = async (req, res) => {
  try {
  } catch (e) {
    console.error('error updating doctor: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM doctors WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'doctor not found' });
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error deleting doctor: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

module.exports = {
  getAllDoctors,
  getDoctor,
  getDoctorByEmail,
  postDoctor,
  updateDoctor,
  deleteDoctor
}