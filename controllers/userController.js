const { createConnection } = require('../database');

exports.registerUser = async (req, res) => {
    const { username, password, access_code } = req.body;

    if (!username || !password || !access_code) {
        return res.status(400).json({ success: false, message: 'Username, password, and access code are required' });
    }

    try {
        const connection = await createConnection();
        const [existingUser] = await connection.execute('SELECT * FROM tbl_61_users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            connection.end();
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const query = 'INSERT INTO tbl_61_users (username, password, access_code) VALUES (?, ?, ?)';
        await connection.execute(query, [username, password, access_code]);
        connection.end();

        res.json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    try {
        const connection = await createConnection();
        const [user] = await connection.execute('SELECT * FROM tbl_61_users WHERE username = ? AND password = ?', [username, password]);

        if (user.length === 0) {
            connection.end();
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        connection.end();
        res.json({ success: true, message: 'Login successful', user: user[0] });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
