const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT *FROM Users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Wrong username' });
        }

        const user = rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(404).json({ message: 'Wrong password' });
        }

        if (user.is_active !== 1) {
            return res.status(403).json({ message: 'Account disabled' });
        }

        const token = jwt.sign(
            { id: user.userID, username: user.username, admin: user.admin },
            'myKey',
            { expiresIn: '1d' }
        )

        res.json({
            message: 'Login success',
            token,
            user: {
                id: user.userID,
                username: user.username,
                fullname: user.fullname,
                date_of_birth: user.date_of_birth,
                phone_number: user.phone_number
            }
        })
    }
    catch (err) {
        console.error('Error Login', err);
        res.status(500).json({ message: 'Server Error' });
    }

}

// REGISTER

exports.registerUser = async (req, res) => {
    const { username, password, fullname, date_of_birth, phone_number } = req.body;

    try {
        const [existing] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(404).json({ message: "username existing" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await db.execute(
            'INSERT INTO Users(username, password, fullname, date_of_birth, phone_number) VALUES (?, ?, ?, ?, ?)',
            [username, hashPassword, fullname, date_of_birth, phone_number]
        )

        res.status(200).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}
