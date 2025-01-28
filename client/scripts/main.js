import { displayEditor } from "./editor.js"
import { exportPopupContent } from "./export.js"

const playButton = document.getElementById('play')
const loadButton = document.getElementById('load')
const exportButton = document.getElementById('export')
const importButton = document.getElementById('import')
const overlay = document.getElementById('overlay')
const closePopupButton = document.getElementById('closePopup')
const confirmPopupButton = document.getElementById('confirmPopup')
const loginButton = document.getElementById('loginButton')

function displayPopup(displayContent) {
    overlay.className = ''
    displayContent()
}

closePopupButton.onclick = () => closePopup()

confirmPopupButton.addEventListener('click', closePopup)

function closePopup() {
    overlay.className = 'hidden'
}

loginButton.addEventListener("click", function() {
    window.location.href = "login.html";
});

exportButton.onclick = () => {
    displayPopup(exportPopupContent)
}

displayEditor()