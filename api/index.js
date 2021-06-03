const express = require('express');
const app = express();

app.get('/create-room', (_req, res) => {
	res.send('Testing');
});

module.exports = app;
