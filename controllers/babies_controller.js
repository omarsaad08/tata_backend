const { pool } = require('../configs/db_conf');

const getAllBabies = async (req, res) => {
  try {
    const query = `SELECT * FROM babies`;
    const result = await pool.query(query);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'no babies found' });
    res.status(200).json(result.rows);
  } catch (e) {
    console.error('error fetching babies: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const getBabyById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM babies WHERE id = $1`;
    const result = await pool.query(query, [id]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error fetching doctors: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const getBabyByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const query = `SELECT * FROM babies WHERE email = $1`;
    const result = await pool.query(query, [email]);
    if (result.rows.length == 0) {
      return res.status(400).json({ error: "there is no baby with this email" });
    }
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error fetching baby: ', e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const postBaby = async (req, res) => {
  try {
    const { name, email, phone, date_of_birth } = req.body;
    const query = `INSERT INTO babies(name, email, phone, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [name, email, phone, date_of_birth]);
    res.status(200).send(result.rows[0]);
  } catch (e) {
    console.error('error fetching doctors: ', e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

const updateBaby = async (req, res) => {

}

const deleteBaby = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM babies WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'baby not found' });
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('errror deleting baby:', e);
    res.status(500).json({ error: `server error: ${e}` });
  }
}

module.exports = {
  getAllBabies,
  getBabyById,
  getBabyByEmail,
  postBaby,
  updateBaby,
  deleteBaby
}