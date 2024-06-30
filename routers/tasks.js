const express = require('express')
const tasksRouter = express.Router()
const fs = require('fs')
const path = require('path');
const tasksPath = path.join(__dirname, 'tasks.json')
const usersPath = path.join(__dirname, 'users.json');

//  {
//     "id": 101,
//     "title": "Homepage Design",
//     "description": "Create a new design for the homepage that aligns with the new branding guidelines.",
//     "status": "Completed",
//     "assignee": "Alice Johnson", // User name or User ID of the assignee (502) 
//     "dueDate": "2024-08-01"
// }
tasksRouter.post('/', (req, res) => {
    let newTask = req.body;
    let flag
    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            users = JSON.parse(data)
            let found = users.find(elm => elm.userId == newTask.assignee)
            if (!found) {
                flag = false
                return res.status(400).send("not valid asignee")
            }
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }

    })
    if (flag) {
        fs.readFile(tasksPath, 'utf-8', (err, data) => {
            if (err) {
                console.error('File does not exit');
                return res.status(500).send('Internal server error');
            }
            let tasks = [];

            try {
                tasks = JSON.parse(data);
                let found = tasks.find(elm => elm.id == newTask.id)
                if (found) {
                    return res.status(400).send("task with this id already exists")
                }
                tasks.push(newTask);
                fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error('Cannot add Task');
                        return res.status(500).send('Internal server error');
                    }
                    return res.status(201).send({ message: 'Task created' });
                });
            } catch (err) {
                console.error('Something went wrong while parsing data');
            }
        });
    }

});

tasksRouter.get('/', (req, res) => {

    fs.readFile(tasksPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        let tasks = [];

        try {
            tasks = JSON.parse(data);
            res.status(200).send(tasks)

        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    });
});

tasksRouter.get(`/:taskId`, (req, res) => {
    fs.readFile(tasksPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            tasks = JSON.parse(data)

            let found = tasks.find(elm => elm.id == req.params.taskId)

            // console.log(req.params.taskId);

            if (found) {
                res.status(200).send(found)
            } else {
                res.status(400).send("Id not found")
            }
        } catch {
            console.error('Something went wrong while parsing data');
        }


    })
});
tasksRouter.put(`/:taskId`, (req, res) => {
    fs.readFile(tasksPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data)
            let foundIndex = tasks.findIndex(elm => elm.id == req.params.taskId)
            if (foundIndex != -1) {
                tasks[foundIndex] = { ...req.body }
                fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error('Cannot add Task');
                        return res.status(500).send('Internal server error');
                    }

                    return res.status(201).send({ message: 'Task updated' });

                });

            } else {
                res.status(400).send("Id not found")
            }
        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }

    })

});
tasksRouter.delete(`/:taskId`, (req, res) => {
    fs.readFile(tasksPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let tasks = JSON.parse(data)
            updatedtasks = tasks.filter(elm => elm.id != req.params.taskId)
            fs.writeFile(tasksPath, JSON.stringify(updatedtasks, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add Task');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'Task deleted' });

            });

        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }
    })

});

module.exports = tasksRouter;