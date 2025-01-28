import { data } from "./editor.js";
import { getEndpointsURL } from "./utils.js";

let message;

export async function saveData() {
    const API_URL = getEndpointsURL()

    const melody = data.getData()

    if (melody.chords.length === 0) {
        message = "No chords in song"
        return;
    }

    const response = await fetch(`${API_URL}?action=save_melody`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(melody),
    });

    if (response.ok) {
        message = 'Song saved'
    } else {
        message = 'Error saving song'
    }
}

const popupContent = document.getElementById('popupContent')
const popupTitle = document.getElementById('popupTitle')

export function savePopup() {
    popupContent.innerText = message
    popupTitle.innerText = 'Save'
}
