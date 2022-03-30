const APIURL = 'http://127.0.0.1:443'
const inputbox = document.getElementById('webhooklink')
const responsetext = document.getElementById('responsedata')
const sendbutton = document.getElementById('sendbutton')
console.log("script loaded")

async function webhookRequest() {
    console.log('submitted')
    var webhooklink = inputbox.value
    responsetext.style.display = 'block'
    inputbox.value = null
    const message = '@ everyone Webhook is gone!'
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
    .then(data => {
        responsetext.innerHTML = data
    })
    .catch(error => {
        console.log(error)
    })
}

sendbutton.addEventListener('click', webhookRequest)