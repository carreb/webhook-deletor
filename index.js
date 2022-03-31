const inputbox = document.getElementById('webhooklink')
const responsetext = document.getElementById('responsedata')
const sendbutton = document.getElementById('sendbutton')
const customize = document.getElementById('customize')
const messageInput = document.getElementById('whMessage')
const usernameInput = document.getElementById('whUsername')
const avatarInput = document.getElementById('whAvatarUrl')
var customizeEnabled = false
const header = {
    "Content-Type": "application/json",
}
console.log("script loaded")

customize.checked = false

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
    let webhookdata = await getID()
    var webhookid = webhookdata[0];
    var webhooktoken = webhookdata[1];
    console.log(webhookid)
    console.log(webhooktoken)
    var webhooklink = inputbox.value
    responsetext.style.display = 'block'
    inputbox.value = null
    if (customizeEnabled == true) {
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
// Add event listener that runs the webhookRequest function when enter is pressed in the input box.
inputbox.addEventListener('keypress', function(e) {
    if (e.key === "Enter") {
        webhookRequest()
    }
})
