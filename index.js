const APIURL = 'http://127.0.0.1:443'
const inputbox = document.getElementById('webhooklink')
const responsetext = document.getElementById('responsedata')
const sendbutton = document.getElementById('sendbutton')
console.log("script loaded")

async function getID() {
    // gets the webhook id from the link
    var webhooklink = inputbox.value
    var webhookid = webhooklink.split('/')[5]
    var webhooktoken = webhooklink.split('/')[6]
    return [webhookid, webhooktoken];

}

async function webhookRequest() {
    console.log('submitted')
    let webhookdata = await getID()
    var webhookid = webhookdata[0];
    var webhooktoken = webhookdata[1];
    console.log(webhookid)
    console.log(webhooktoken)
    var webhooklink = inputbox.value
    responsetext.style.display = 'block'
    inputbox.value = null
    const message = 'test message'
    const username = Math.random().toString()
    const data = {
        "content": message,
        "username": username,
        "tts": true
    }
    const header = {
        "Content-Type": "application/json",
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
    // Send a DELETE request to the webhook. If the response is 204, change the text to 'Successfully deleted'.
    fetch(webhooklink, {
        method: 'DELETE',
        headers: header
    })
    .then(response => {
        if (response.status == 204) {
            responsetext.innerHTML = 'Successfully deleted'
        } else {
            responsetext.innerHTML = 'Failed to delete'
        }
    })
    .catch(error => {
        console.log(error)
    })

}

sendbutton.addEventListener('click', webhookRequest)