import { displayEditor } from "./editor.js"
import { exportConfirm, exportPopupDisplay } from "./export.js"
import { confirmLoad, loadData, loadPopup } from "./load.js"
import { saveData, savePopup } from "./save.js"

const playButton = document.getElementById('play')
const saveButton = document.getElementById('save')
const loadButton = document.getElementById('load')
const exportButton = document.getElementById('export')
const importButton = document.getElementById('import')
const overlay = document.getElementById('overlay')
const closePopupButton = document.getElementById('closePopup')
const confirmPopupButton = document.getElementById('confirmPopup')
const loginButton = document.getElementById('loginButton')
const userMessage = document.getElementById('userMessage')


const username = localStorage.getItem("username")
if (username) {
    userMessage.innerText = `Hello, ${username}`
}

function displayPopup(displayContent, confirmHandler) {
    overlay.className = ''
    displayContent()
    function removeHandler() {
        confirmPopupButton.removeEventListener('click', confirmHandler)
        confirmPopupButton.removeEventListener('click', removeHandler)
    }
    confirmPopupButton.addEventListener('click', confirmHandler)
    confirmPopupButton.addEventListener('click', removeHandler)
}

closePopupButton.onclick = () => closePopup()

confirmPopupButton.addEventListener('click', closePopup)

function closePopup() {
    const popupContent = document.getElementById('popupContent')
    popupContent.innerHTML = ""
    overlay.className = 'hidden'
}

loginButton.addEventListener("click", function() {
    window.location.href = "login.html";
});

exportButton.onclick = () => {
    displayPopup(exportPopupDisplay, exportConfirm)
}

saveButton.onclick = async () => {
    await saveData()
    displayPopup(savePopup, () => {})
}

loadButton.onclick = async () => {
    await loadData()
    displayPopup(loadPopup, confirmLoad)
}

displayEditor()