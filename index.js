const inputbox = document.getElementById('webhooklink')
const responsetext = document.getElementById('responsedata')
const sendbutton = document.getElementById('sendbutton')
const customize = document.getElementById('customize')
const messageInput = document.getElementById('whMessage')
const usernameInput = document.getElementById('whUsername')
const avatarInput = document.getElementById('whAvatarUrl')
var customizeEnabled = false
var readytosend = {}
const header = {
    "Content-Type": "application/json",
}
console.log("script loaded")

// Resets customize checkbox upon refresh
customize.checked = false

// Enables and disables customization
function enableCustomization() {
        customizeEnabled = true
        messageInput.style.display = 'block'
        usernameInput.style.display = 'block'
        avatarInput.style.display = 'block'
        customize.checked = true
}

function disableCustomization() {
    customizeEnabled = false
        messageInput.style.display = 'none'
        usernameInput.style.display = 'none'
        avatarInput.style.display = 'none'
        customize.checked = false
}

customize.onclick = () => {
    if (customize.checked == true) {
        enableCustomization()
    } else {
        disableCustomization()
    }
}

async function getID() {
    // gets the webhook id from the link
    var webhooklink = inputbox.value
    var webhookid = webhooklink.split('/')[5]
    var webhooktoken = webhooklink.split('/')[6]
    return [webhookid, webhooktoken];

}

async function webhookRequest() {
    // Sets up for the webhook request
    console.log('submitted')
    document.getElementById('checkbutton').style.display = 'block'
    document.getElementById('sendbutton').style.display = 'none'
    document.getElementsByClassName('webhookinfo')[0].style.display = 'none'
    readytosend.self = false
    let webhookdata = await getID()
    var webhookid = webhookdata[0];
    var webhooktoken = webhookdata[1];
    console.log(webhookid)
    console.log(webhooktoken)
    var webhooklink = inputbox.value
    responsetext.style.display = 'block'
    inputbox.value = null
    if (customizeEnabled == true) {
        // Customization (Sends a message with custom username and avatar)
        var message = messageInput.value
        var username = usernameInput.value
        var avatarurl = avatarInput.value
        avatarInput.value = null
        messageInput.value = null
        usernameInput.value = null
        disableCustomization()
        console.log(message)
        console.log(username)
        console.log(avatarurl)
        var data = {
            "username": username,
            "avatar_url": avatarurl,
            "content": message,
            "tts": true
        }
        fetch(webhooklink, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: header
    })
    .then(response => response.json())
    .catch(error => {
        console.log(error)
    })
    }
    // Send a DELETE request to the webhook. If the response is 204, change the text to 'Successfully deleted'.
    fetch(webhooklink, {
        method: 'DELETE',
        headers: header
    })
    .then(response => {
        console.log(response)
        if (response.status == 204) {
            responsetext.innerHTML = 'Successfully deleted'
        } else {
            responsetext.innerHTML = 'Failed to delete - Error ' + response.status + ' [' + response.statusText + ']'
        }
    })
    .catch(error => {
        console.log(error)
    })

}

sendbutton.addEventListener('click', webhookRequest)
inputbox.addEventListener('keydown', function(e){
    if (readytosend.self == true) {
        if (e.key == "Enter") {
            webhookRequest()
        }
        else {
            responsetext.innerHTML = 'You edited the webhook link. Please check the validity again.'
            document.getElementById('checkbutton').style.display = 'block'
            document.getElementById('sendbutton').style.display = 'none'
            document.getElementsByClassName('webhookinfo')[0].style.display = 'none'
            readytosend.self = false
        }
    } else {
        if (e.key == "Enter") {
            validWebhookCheck()
        }
    }
})


document.getElementById('checkbutton').addEventListener('click', () => {
    // Checks if the webhook link is valid
    var webhooklink = inputbox.value
    var webhookid = webhooklink.split('/')[5]
    const webhookName = document.getElementById('webhookName')
    const webhookServer = document.getElementById('webhookServer')
    const webhookChannel = document.getElementById('webhookChannel')
    const webhookAvatar = document.getElementById('webhookAvatar')
    if (webhooklink.includes('discord.com/api/webhooks')) {
        fetch(inputbox.value, {
        method: 'GET',
        headers: header
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        responsetext.style = 'display: block;'
        if (data.code == 10015) {
            responsetext.innerHTML = 'This webhook does not exist.'
        } else {
            responsetext.innerHTML = 'Valid webhook link! Press enter or click the button again to delete it.'
            document.getElementById('checkbutton').style.display = 'none'
            document.getElementById('sendbutton').style.display = 'block'
            readytosend.self = true
            webhookAvatar.src = "https://cdn.discordapp.com/avatars/" + webhookid + "/" + data.avatar
            webhookName.innerHTML = data.name
            webhookServer.innerHTML = "In server with ID: " + data.guild_id
            webhookChannel.innerHTML = "In channel with ID: " + data.channel_id
            document.getElementsByClassName('webhookinfo')[0].style.display = 'block'
        }
    })   
    } else {
        responsetext.style = 'display: block;'
        responsetext.innerHTML = 'Not a discord webhook link.'
    }
})

function validWebhookCheck() {
    var webhooklink = inputbox.value
    var webhookid = webhooklink.split('/')[5]
    const webhookName = document.getElementById('webhookName')
    const webhookServer = document.getElementById('webhookServer')
    const webhookChannel = document.getElementById('webhookChannel')
    const webhookAvatar = document.getElementById('webhookAvatar')
    if (webhooklink.includes('discord.com/api/webhooks')) {
        fetch(inputbox.value, {
        method: 'GET',
        headers: header
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        responsetext.style = 'display: block;'
        if (data.code == 10015) {
            responsetext.innerHTML = 'This webhook does not exist.'
        } else {
            responsetext.innerHTML = 'Valid webhook link! Press enter or click the button again to delete it.'
            document.getElementById('checkbutton').style.display = 'none'
            document.getElementById('sendbutton').style.display = 'block'
            readytosend.self = true
            webhookAvatar.src = "https://cdn.discordapp.com/avatars/" + webhookid + "/" + data.avatar
            webhookName.innerHTML = data.name
            webhookServer.innerHTML = "In server with ID: " + data.guild_id
            webhookChannel.innerHTML = "In channel with ID: " + data.channel_id
            document.getElementsByClassName('webhookinfo')[0].style.display = 'block'
        }
    })   
    } else {
        responsetext.style = 'display: block;'
        responsetext.innerHTML = 'Not a discord webhook link.'
    }
}