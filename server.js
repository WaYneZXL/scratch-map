const express = require('express');

const app = express();

app.get('/users', (req, res) => {
  const users = [
    {id: 1, firstName: 'Chris'},
    {id: 2, firstName: 'Edward'},
    {id: 3, firstName: 'Khubaib'},
    {id: 4, firstName: 'data fetched from backend'},
  ];

  res.json(users);
});

const port = 8080;

app.listen(port, () => `Server running on port ${port}`);
