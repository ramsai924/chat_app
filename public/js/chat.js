const socket = io()

//elements
const mainForm = document.querySelector('#form');
const inputField = mainForm.querySelector("input");
const buttonSend = mainForm.querySelector("button");
const messagesDisplay = document.querySelector("#messagesDisplay");
const sendLocationButton = document.querySelector('#send-location')

//template
const messageSrcipt = document.querySelector('#messageScript').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const welcomeScript = document.querySelector("#welcomeScript").innerHTML
const usersOnlinecript = document.querySelector("#usersOnlinecript").innerHTML
const typingmsgScript = document.querySelector("#typingmsgScript").innerHTML

const scrollAction = () => {
        messagesDisplay.scrollTop = messagesDisplay.scrollHeight
}

//message
socket.on('message' , (msg) => {
    console.log(msg)
    const htmlTemplate = Mustache.render(messageSrcipt , {
        username : msg.username,
        message : msg.text,
        time: moment(msg.createdAt).format("h:mm a")
    })
    messagesDisplay.insertAdjacentHTML('beforeend', htmlTemplate) 
    scrollAction()
})

//
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messagesDisplay.insertAdjacentHTML('beforeend', html)
    scrollAction()
})

socket.on("welcome" , (msg) => {
    console.log(msg);
    const html = Mustache.render(welcomeScript, {
      welcome: msg.username,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
    messagesDisplay.insertAdjacentHTML("beforeend", html);
})

//send message
document.getElementById("form").addEventListener("submit" , (e) => {
    e.preventDefault()

    const message = document.getElementById("message").value;
    socket.emit("sendMessage" , message , (error) => {

        inputField.value = "";
        inputField.focus();

        if(error){
            return console.log(error)
        }

        console.log("message delivered");
    })

  
})

//Query objects
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//when User join
socket.emit('join', { username, room } , (error) => {
    if(error){
        alert("another user with same name");
        window.location = '/'
    }
})

//user sharing location
sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})

//get users in room/online
socket.on("roomData", ({room , users}) => {
    // console.log(data)
    const htmlTemplate = Mustache.render(usersOnlinecript, {
        room,
        users
    })
    document.querySelector("#displayOnline").innerHTML = htmlTemplate;
})


//Typing message
socket.on("typekeyss" , (data) => {

    document.getElementById("form").addEventListener("submit",() => {
        socket.emit("typing", { room: data.room, name: "", text: "" })
    })

    inputField.addEventListener("click", () => {
        socket.emit("typing", { room : data.room ,name : data.username , text : "Typing..."})
        
    })

    socket.on("TypePopup", (data) => {
        const htmlTemplate = Mustache.render(typingmsgScript, {
            name: data.name,
            text: data.text
        })
        document.querySelector("#typingmsgs").innerHTML = htmlTemplate;
    })
})




