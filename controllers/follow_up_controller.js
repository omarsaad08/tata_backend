const { pool } = require('../configs/db_conf');

const getAllFollowUps = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM follow_up WHERE baby_id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: `no follow ups found for that baby` });
    res.status(200).json(result.rows);
  } catch (e) {
    console.error('error fetching doctors: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
};

const getLastFollowUp = async (req, res) => {
  try {
    const { id } = req.parms;
    const query = `SELECT * FROM follow_up WHERE baby_id = $1 ORDER BY follow_up_date DESC LIMIT 1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: `no follow ups found for that baby` });
    res.status(200).json(result.rows);
  } catch (e) {
    console.error('error fetching doctors: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
};

const getFollowUpByDate = async (req, res) => {
  try {
    const { id, date } = req.params;
    const query = `SELECT * FROM follow_up WHERE date = $1`;
    const result = await pool.query(query);
    if (result.rows.length === 0)
      return res.status(404).json({ error: `no follow ups found for that baby in that date` });
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error('error fetching doctors: ', error);
    res.status(500).json({ error: `server error: ${e}` });
  }
};

const postFollowUp = async (req, res) => {
  try {
    const { baby_id, follow_up_date, motorMilestones, feedingMilestones, communicationMilestones, sensoryMilestones, healthy, ageInMonths, notes } = req.body;
    const query = `INSERT INTO follow_up (baby_id, follow_up_date, motorMilestones, feedingMilestones, communicationMilestones, sensoryMilestones, healthy, ageInMonths,  notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const result = await pool.query(query, [baby_id, follow_up_date, motorMilestones, feedingMilestones, communicationMilestones, sensoryMilestones, healthy, ageInMonths, notes]);
    res.status(200).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `server error: ${e}` });
  }
};

const updateFollowUp = async (req, res) => {

};

const deleteFollowUp = async (req, res) => {

};

module.exports = {
  getAllFollowUps,
  getLastFollowUp,
  getFollowUpByDate,
  postFollowUp,
  updateFollowUp,
  deleteFollowUp
}