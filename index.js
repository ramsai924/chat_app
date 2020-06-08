const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const { messageFunction , generateLocationMessage } = require('./messages')
const { addUser, removeUser, getUser, getusersInRoom } = require('./users')

const port = process.env.PORT || 3000 ;

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDierctory = path.join(__dirname, './public')
app.use(express.static(publicDierctory));

//when user connected
io.on('connection' , (socket) => {

    //When user joins room
    socket.on('join' , ({ username , room } , callback) => {

        const users = addUser({ id: socket.id , username , room})

        if (users.error){
            return callback(users.error)
        }

        socket.join(users.room)

        socket.emit("welcome", messageFunction("Welcome..!"))

        socket.broadcast.to(users.room).emit("welcome", messageFunction(`${users.username} joined`))

        io.to(users.room).emit("roomData" , {
            room : users.room,
            users : getusersInRoom(users.room)
        })
        callback()

        //Type msg event
        socket.emit("typekeyss", users)
    })

    //When send message
    socket.on("sendMessage" , (message , callback) => {
       
        const getusermsg = getUser(socket.id)
        io.to(getusermsg.room).emit("message", messageFunction(getusermsg.username , message))
        callback()
    })


    //Send location
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    }) 


    //Typing popoUp msg
    socket.on("typing" , (TypeData) => {
        socket.broadcast.to(TypeData.room).emit("TypePopup", TypeData)
    })


    //When user disconnect
    socket.on('disconnect' , () => {
        const user = removeUser(socket.id)
    
        if(user){
            io.to(user.room).emit("welcome", messageFunction(`${user.username} left the chat`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getusersInRoom(user.room)
            })
        }
        
    })

})

server.listen(port, () => {
    console.log(`Listening to PORT : ${port}`);
});