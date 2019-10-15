const express = require('express');

const app = express();

const Projects = [];
let requestCount = 0;

function checkProjectID(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: 'ID é obrigatório!'});
  }
  return next();
}

function checkProjectTitle(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Título é obrigatório!'});
  }
  return next();
}

function countRequests(req, res, next) {
  requestCount++;
  console.log(`Número de requisições: ${requestCount}`);
  return next();
}

app.use(express.json());
app.use(countRequests);

app.get('/projects', (req, res) => {
  res.json(Projects);
});

app.post('/projects', checkProjectTitle, (req, res) => {
  Projects.push(req.body);
  return res.json(Projects);
});

app.put('/projects/:id', checkProjectID, checkProjectTitle, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  Projects.map(item => {
    if (item.id === id) {
      item.title = title;
    }
  });

  return res.json(Projects);
});

app.post('/projects/:id/tasks', checkProjectID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let index;

  Projects.map((item, i) => {
    if (item.id === id) {
      item.tasks.push(title);
      index = i;
    }
  });

  return res.json(Projects[index]);
})

app.delete('/projects/:id', checkProjectID, (req, res) => {
  const { id } = req.params;
  Projects.map((item, index) => {
    if (item.id === id) {
      Projects.splice(index, 1);
    }
  });
  return res.send();
});

app.listen(3333);