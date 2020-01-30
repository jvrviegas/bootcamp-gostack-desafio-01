const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let requestsCount = 0;

function checkProjectInArray(req, res, next){
   const {id} = req.params;
   const index = projects.findIndex(item => item.id === id);
   if(!projects[index]){
      return res.status(400).json({error: "Project doesn't exists"});
   }

   req.index = index;

   return next();
}

server.use((req, res, next) => {
   requestsCount++;
   console.log(`Nº de Requisições: ${requestsCount}`);

   return next();
});

server.get('/projects', (req, res) => {
   return res.json(projects);
});

server.get('/projects/:id', checkProjectInArray, (req, res) => {
   return res.json(req.project);
});

server.post('/projects', (req, res) => {
   const {id, title} = req.body;

   const project = {
      id,
      title,
      tasks: []
   };

   projects.push(project);
   return res.json(project);
});

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
   const {id} = req.params;
   const {title} = req.body;
   const index = req.index;

   projects[index].tasks.push(title);

   return res.json(projects[index]);
});

server.put('/projects/:id', checkProjectInArray, (req, res) => {
   const {id} = req.params;
   const {title} = req.body;
   const index = req.index;

   projects[index].title = title;

   return res.json(projects[index]);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
   const {id} = req.params;

   projects.splice(id, 1);

   return res.status(200).json({message: "Project deleted successfully!"});
});

server.listen(3000);