import { data } from "./editor.js";
import { getEndpointsURL } from "./utils.js";

let message;
let songs;

export async function loadData() {
    const response = await fetch(`${getEndpointsURL()}?action=get_melodies`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.ok) {
        songs = await response.json().then(res => res.data)
        if (songs.length === 0) {
            songs = null
            message = "No saved songs"
            return;
        }
        message = "Choose song:"
    } else {
        message = popupContent.innerText = "Error loading songs"
        songs = null
    }
}

const popupContent = document.getElementById('popupContent')
const popupTitle = document.getElementById('popupTitle')

let newSongIndex;

export function loadPopup() {
    popupTitle.innerText = "Load"
    const msg = document.createElement('section')
    msg.innerText = message
    popupContent.appendChild(msg)
    if (!songs) {
        return
    }
    const songSelector = document.createElement('select')
    songSelector.className = 'songSelector selector'
    songSelector.size = Math.min(10, songs.length)

    songs.forEach((song, index) => {
        const option = document.createElement('option')
        if (index === 0) {
            option.selected = true
        }
        option.value = index
        option.innerText = song.title
        songSelector.appendChild(option)
    })    

    songSelector.onchange = (e) => {
        newSongIndex = e.target.value
    }

    popupContent.appendChild(songSelector)

    newSongIndex = 0
}

export function confirmLoad() {
    if (!songs) {
        return;
    }
    data.setData(songs[newSongIndex])
}