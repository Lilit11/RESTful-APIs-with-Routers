const path = require('path');
const fs = require('fs')
const express = require('express')
const projectsRouter = express.Router()
const projectsPath = path.join(__dirname, 'projects.json')
const tasksPath = path.join(__dirname, 'tasks.json')
const usersPath = path.join(__dirname, 'users.json');


// {
//     "id": 1001,
//     "name": "Website Redesign",
//     "description": "Complete overhaul of the corporate website to improve user interface and overall user experience.",
//     "startDate": "2024-07-01",
//     "endDate": "2024-12-31",
//     "status": "In Progress",
//     "budget": 75000,
//     "currency": "USD",
//     "team": [501, 502, 503],  // List of user IDs
//     "tasks": [101, 102, 103]  // List of task IDs
// }

projectsRouter.post('/', (req, res) => {
    let newProj = req.body;
    let validUser = true
    let validTask = true
    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        let users = [];
        try {
            users = JSON.parse(data).map(elm => elm.userId);
            let temp = newProj.team.map(element => users.includes(element))
            validUser = temp.every(user => user === true)
            if (!validUser) {
                return res.status(400).send("not valid asignee")
            }

        } catch (err) {
            console.error('Something went wrong while parsing data');
        }

        fs.readFile(tasksPath, 'utf-8', (err, data) => {
            if (err) {
                console.error('File does not exit');
                return res.status(500).send('Internal server error');
            }
            let tasks = [];
            try {
                tasks = JSON.parse(data).map(elm => elm.id);
                let temp = newProj.tasks.map(element => tasks.includes(element))
                validTask = temp.every(task => task === true)
                if (!validTask) {
                    return res.status(400).send("not valid task Id")
                }
            } catch (err) {
                console.error('Something went wrong while parsing data');
            }



            if (validUser == true && validTask == true) {
                fs.readFile(projectsPath, 'utf-8', (err, data) => {
                    if (err) {
                        console.error('File does not exit');
                        return res.status(500).send('Internal server error');
                    }
                    let projects = [];

                    try {
                        projects = JSON.parse(data);
                        let found = projects.find(elm => elm.id == newProj.id)
                        if (found) {
                            return res.status(400).send("project with this id already exists")
                        }
                        projects.push(newProj);
                        fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), (err) => {
                            if (err) {
                                console.error('Cannot add project');
                                return res.status(500).send('Internal server error');
                            }
                            return res.status(201).send({ message: 'project created' });
                        });

                    } catch (err) {
                        console.error('Something went wrong while parsing data');
                    }


                });
            }
        })
    })
});

projectsRouter.get('/', (req, res) => {

    fs.readFile(projectsPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        let projects = [];

        try {
            projects = JSON.parse(data);
            res.status(200).send(projects)

        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    });
});

projectsRouter.get(`/:projId`, (req, res) => {
    fs.readFile(projectsPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }

        try {
            projects = JSON.parse(data)
            let found = projects.find(elm => elm.id == req.params.projId)
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
projectsRouter.put(`/:projId`, (req, res) => {
    fs.readFile(projectsPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let projects = JSON.parse(data)
            let foundIndex = projects.findIndex(elm => elm.id == req.params.projId)
            if (foundIndex != -1) {
                projects[foundIndex] = { ...req.body }
                fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), (err) => {
                    if (err) {
                        console.error('Cannot add project');
                        return res.status(500).send('Internal server error');
                    }

                    return res.status(201).send({ message: 'project updated' });

                });

            } else {
                res.status(400).send("Id not found")
            }
        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }



    })

});
projectsRouter.delete(`/:projId`, (req, res) => {
    fs.readFile(projectsPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let projects = JSON.parse(data)
            updatedProjects = projects.filter(elm => elm.id != req.params.projId)
            fs.writeFile(projectsPath, JSON.stringify(updatedProjects, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add projects');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'project deleted' });

            });

        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }
    })

});


module.exports = projectsRouter;
