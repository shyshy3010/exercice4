const { createConnection } = require('../database');

exports.chooseVacation = async (req, res) => {
    const { vacationType, location, startDate, endDate, user } = req.body;

    if (!vacationType || !location || !startDate || !endDate || !user) {
        return res.status(400).json({ success: false, message: 'Vacation type, location, start date, end date, and user details are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 7) {
        return res.status(400).json({ success: false, message: 'Date range must be within 7 days' });
    }

    try {
        const connection = await createConnection();
        const [userInDatabase] = await connection.execute('SELECT * FROM tbl_61_users WHERE username = ? AND access_code = ?', [user.name, user.access_code]);

        if (userInDatabase.length === 0) {
            connection.end();
            return res.status(404).json({ success: false, message: 'User not found in database' });
        }

        const [existingVacation] = await connection.execute('SELECT * FROM tbl_61_preferences WHERE user_id = ?', [user.name]);
        if (existingVacation.length > 0) {
            connection.end();
            return res.status(400).json({ success: false, message: 'User already has a vacation booked' });
        }

        const query = `
            INSERT INTO tbl_61_preferences (user_id, start_date, end_date, destinations, vacation_type)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [user.name, startDate, endDate, location, vacationType];
        await connection.execute(query, values);
        connection.end();

        res.json({ success: true, message: 'Vacation booked successfully!' });
    } catch (error) {
        console.error('Error choosing vacation:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.updateVacationDetails = async (req, res) => {
    const { vacationType, location, startDate, endDate, user } = req.body;

    if (!vacationType || !location || !startDate || !endDate || !user) {
        return res.status(400).json({ success: false, message: 'Vacation type, location, start date, end date, and user details are required' });
    }

    try {
        const connection = await createConnection();
        const [userInDatabase] = await connection.execute('SELECT * FROM tbl_61_users WHERE username = ? AND access_code = ?', [user.name, user.access_code]);

        if (userInDatabase.length === 0) {
            connection.end();
            return res.status(404).json({ success: false, message: 'User not found in database' });
        }

        const query = `
            UPDATE tbl_61_preferences
            SET start_date = ?, end_date = ?, destinations = ?, vacation_type = ?
            WHERE user_id = ?
        `;
        const values = [startDate, endDate, location, vacationType, user.name];
        const [result] = await connection.execute(query, values);
        connection.end();

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Vacation details updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Vacation not found' });
        }
    } catch (error) {
        console.error('Error updating vacation details:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// Fonction pour calculer les résultats des vacances
exports.calculateVacationResults = async (req, res) => {
    const query = `
      SELECT vacation_type, destinations, start_date, end_date, COUNT(*) as count
      FROM tbl_61_preferences
      GROUP BY vacation_type, destinations, start_date, end_date
      ORDER BY count DESC
      LIMIT 1
    `;
  
    try {
        const connection = await createConnection();
        const [results] = await connection.execute(query);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No vacation preferences found' });
        }

        res.status(200).json({ success: true, results: results[0] });
    } catch (error) {
        console.error('Error fetching vacation results:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
