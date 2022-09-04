module.exports = (io) => {
    let users = [];
    let userName = "";
    const { DBUser } = require("../DB/dBUser");
    io.on('connection', socket => {
        console.log('new connection');
        let ConnectionDate = new Date();

        socket.on('user connected', (user) => {
            console.log(user);
            console.log(user.fname + " " + user.lname);
            userName = user.fname + " " + user.lname;
            console.log(userName);
            let answer = { user: user, id: socket.id, date: ConnectionDate };
            console.log(answer);
            users.push(answer);
            socket.emit('user', users);
            socket.broadcast.emit('user', users)
        })

        socket.on("disconnect", () => {
            console.log("User has been closed his browser user id is ", socket.id)
            let uid = -1;
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === socket.id) {
                    uid = users[i].user._id;
                }
            }
            console.log('disconnected nowwww', socket.id);
            console.log(users);
            users.splice(users.findIndex(elem => elem.id === socket.id), 1);
            console.log(users);
            if (uid !== -1) {
                DBUser.updateLoggedOut(uid);
            }


        })

        socket.on('disconnectedUser', (id) => {
            let uid;
            console.log("the user", id, "is disconnecting");
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    uid = users[i].user._id;
                }
            }
            console.log('disconnected nowwww', id);
            console.log(users);
            users.splice(users.findIndex(elem => elem.id === socket.id), 1);
            console.log(users);
            console.log("the user" + uid + "has logged out");
            DBUser.updateLoggedOut(uid);
            socket.broadcast.emit('user', users);
        });

        socket.on('new-message', (message) => {
            console.log(userName);
            console.log('message from', message.user, message.mess);
            io.emit(message);
            let answer = JSON.stringify({ userA: message.user, message: message.mess });
            console.log(answer);
            socket.emit('answer', answer);
            socket.broadcast.emit('answer', answer);
        });

        socket.on('privateMessage', (anotherSocketId, message) => {
            console.log('message from', message.user, message.mess, 'to', anotherSocketId);
            let answer = JSON.stringify({ userA: message.user, userB: anotherSocketId, message: message.mess })
            console.log(answer);
            socket.to(anotherSocketId).emit("private-message", answer);
            socket.emit("private-message", answer);
        });

        socket.on('connection', (client) => {
            console.log(client.id);
            client.join("myRoom")

            client.broadcast.emit('newClient', client.id);

            client.on('myMsg', ({ to, content }) => {
                console.log(to, content)
                client.to(to).emit('inMsg', content)
            })

            client.on('myMsgRoom', (content) => {
                console.log(content)
                client.to('myRoom').emit('inMsg', content)
            })

        });
    })
}