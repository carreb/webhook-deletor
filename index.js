const inputbox = document.getElementById('webhooklink')
const responsetext = document.getElementById('responsedata')
const sendbutton = document.getElementById('sendbutton')
const customize = document.getElementById('customize')
const messageInput = document.getElementById('whMessage')
const usernameInput = document.getElementById('whUsername')
const avatarInput = document.getElementById('whAvatarUrl')
const webhookType = document.getElementById('webhookType')
const proxyurl = "https://safe-oasis-79665.herokuapp.com/";
var customizeEnabled = false
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
    whtype = await changeWebhookType()
    console.log(whtype)
    if (whtype === '1') {
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
    else if (whtype === '2') {
        // Send a DELETE request to the webhook. If only the fields "deletedAt" and "id" are returned, change the text to 'Successfully deleted'.
        let webhookdata = await getID()
        var webhookid = webhookdata[0];
        var webhooktoken = webhookdata[1];
        console.log(webhookid)
        console.log(webhooktoken)
        var webhooklink = inputbox.value
        responsetext.style.display = 'block'
        inputbox.value = null
        fetch(proxyurl + webhooklink, {
            method: 'DELETE',
            headers: header
        })
        .then(response => {
            // If the response only returns the fields "deletedAt" and "id", change the text to 'Successfully deleted'.
            if (response.deletedAt !== null) {
                responsetext.innerHTML = 'Successfully deleted'
            }
            else {
                responsetext.innerHTML = 'Failed to delete - Error ' + response.status + ' [' + response.statusText + ']'
            }
        })
        .catch(error => {
            console.log(error)
        }
        )
    }
    

}

sendbutton.addEventListener('click', webhookRequest)
// Add event listener that runs the webhookRequest function when enter is pressed in the input box.
inputbox.addEventListener('keypress', function(e) {
    if (e.key === "Enter") {
        webhookRequest()
    }
})

async function changeWebhookType() {
    // Gets the webhook type from the dropdown menu
    var selectedwhtype = webhookType.options[webhookType.selectedIndex].value
    return selectedwhtype;
}