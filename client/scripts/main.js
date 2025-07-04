import { data, displayEditor } from "./editor.js"
import { logout } from "./logout.js"
import { exportConfirm, exportPopupDisplay, toKeyboardAppJson } from "./export.js"
import { confirmLoad, loadData, loadPopup } from "./load.js"
import { saveData, savePopup } from "./save.js"
import { importData, importPopupDisplay } from "./import.js"

const saveButton = document.getElementById('save')
const loadButton = document.getElementById('load')
const exportButton = document.getElementById('export')
const importInput = document.getElementById('import')
const overlay = document.getElementById('overlay')
const closePopupButton = document.getElementById('closePopup')
const confirmPopupButton = document.getElementById('confirmPopup')
const loginButton = document.getElementById('loginButton')
const logoutButton = document.getElementById('logoutButton')
const keyboardAppButton = document.getElementById('KeyboardApp')


const KEY_BOARDAPP_URL=""

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

logoutButton.onclick=async() =>{
    await logout();
    logoutButton.style.display='none';
    loginButton.style.display='block';
    userMessage.innerText = "";
};

if(localStorage.getItem("username")){
    logoutButton.style.display='block';
    loginButton.style.display='none';
}


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

keyboardAppButton.onclick = async () => {
    const currentData = data.getData();
    const file = toKeyboardAppJson(currentData);
    const blob = new Blob([file], {type: 'text/plain'});
    const blobURL = URL.createObjectURL(blob);
    window.location.href=KEY_BOARDAPP_URL+"/import?file="+blobURL;
}

importInput.addEventListener("change", async () => {
    if (importInput.files.length == 1) {
      const file = importInput.files[0]
      importData(await file.text(), file.name.split('.').slice(-1)[0])
      displayPopup(importPopupDisplay, () => {})
    }
});

displayEditor()