const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const port = 3001;

const usersRouter = require('./routers/users.js')
const projectsRouter = require('./routers/projects.js')
const tasksRouter = require('./routers/tasks.js')



app.use(bodyParser.json())

app.use('/users', usersRouter)
app.use('/projects', projectsRouter)
projectsRouter.use('/:projId/tasks', tasksRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})



