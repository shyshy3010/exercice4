require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3005;

const vacationRoutes = require('./routers/vacationRoutes');
const userRoutes = require('./routers/userRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/vacations', vacationRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
    console.error('Path not found:', req.path);
    res.status(404).send('Path not found!');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
