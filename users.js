const users = [];

//Add users to array
const addUser = ({id , username , room}) => {
        //clean data
        username = username.trim().toLowerCase();
        room = room.trim().toLowerCase()

        if(!username || !room){
            return {
                error : "username or room is missing"
            }
        }

        //checking existing user(if user found returns TRUE)
        const existingUser = users.find((user) => {
            return user.room === room && user.username === username
        })

        //validate
        if(existingUser){
            return {
                error : "username is in use"
            }
        }

        const user = { id,username,room }
        users.push(user)
        return user;
}

//Remove user from array
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    // console.log("index" , index)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

//Get user from array
const getUser = (id) => {
    const finds = users.find((user) => {
        return user.id === id
    })

    return finds;
}

//Get users in the same room
const getusersInRoom = (room) => {
   room = room.trim().toLowerCase()
    const usersget = users.filter((user) => {
        return user.room === room;
    })
    
    return usersget;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getusersInRoom
}
