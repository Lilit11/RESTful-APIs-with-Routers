const express = require('express')
const fs = require('fs')
const usersRouter = express.Router()

const path = require('path');
const usersPath = path.join(__dirname, 'users.json');

// User : {
//     "userId": 503,
//     "name": "Alice Johnson",
//     "email": "alice.johnson@example.com",
//     "role": "UX/UI Designer"
//   }

usersRouter.post('/', (req, res) => {
    let newUser = req.body;

    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        let users = [];

        try {
            users = JSON.parse(data);
            let found = users.find(elm => elm.userId == newUser.userId)
            if (found) {
                return res.status(400).send("user with this id already exists")
            }
            users.push(newUser);
            fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add user');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'User created' });
            });
        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    });
});

usersRouter.get('/', (req, res) => {

    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        let users = [];

        try {
            users = JSON.parse(data);
            res.status(200).send(users)

        } catch (err) {
            console.error('Something went wrong while parsing data');
        }
    });
});

usersRouter.get(`/:userId`, (req, res) => {
    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            users = JSON.parse(data)
            let found = users.find(elm => elm.userId == req.params.userId)
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
usersRouter.put(`/:userId`, (req, res) => {
    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let users = JSON.parse(data)
            let foundIndex = users.findIndex(elm => elm.userId == req.params.userId)
            if (foundIndex != -1) {
                users[foundIndex] = { ...req.body }
                fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        console.error('Cannot add user');
                        return res.status(500).send('Internal server error');
                    }

                    return res.status(201).send({ message: 'User updated' });

                });

            } else {
                res.status(400).send("Id not found")
            }
        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }



    })

});
usersRouter.delete(`/:userId`, (req, res) => {
    fs.readFile(usersPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File does not exit');
            return res.status(500).send('Internal server error');
        }
        try {
            let users = JSON.parse(data)
            updatedUsers = users.filter(elm => elm.userId != req.params.userId)
            fs.writeFile(usersPath, JSON.stringify(updatedUsers, null, 2), (err) => {
                if (err) {
                    console.error('Cannot add user');
                    return res.status(500).send('Internal server error');
                }
                return res.status(201).send({ message: 'User deleted' });

            });

        } catch (err) {
            console.error('Something went wrong while parsing data'), err;
        }
    })

});



module.exports = usersRouter;