const messageFunction = (username,text) => {
    return {
        username: username,
        text : text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    messageFunction,
    generateLocationMessage
}