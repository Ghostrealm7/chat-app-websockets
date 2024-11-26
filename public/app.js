const socket = io('ws://localhost:3500')


const msgInput = document.querySelector('input')
const activity = document.querySelector('.activity')

function sendMessage () {
  e.preventDefault()
  if (msgInput.value) {
    socket.emit('message', msgInput.value)
    msgInput.value = ""
  }
  msgInput.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage)

// listen for messages from server
socket.on('message', (data)=>{
  activity.textContent = ""
  const li = document.createElement('li')
  li.textContent = {data}
  document.querySelector('ul').appendChild(li)
})

//Send activity event
msgInput.addEventListener('keypress', ()=> {
  socket.emit('activity', socket.id.substring(0,5))
})

//Receive activity event
let activityTimer
socket.on(activity, (name)=>{
  activity.textContent = `${name} is typing...`
  //Clear activity afte 3 seconds
  clearTimeout(activityTimer)
  activityTimer = setTimeout(()=>{
    activity.textContent = ""
  }, 3000)
})

