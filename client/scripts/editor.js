const editor = document.getElementById('tabEditor')
const titleInput = document.getElementById('titleInput')

//                     0    1     2    3     4    5     6    7    
const chordLetters = ["A", "A#", "B", "C", "C#", "D", "D#", "E",
//   8    9     10   11
    "F", "F#", "G", "G#"];
//                    0     1
const chordTypes = ['maj', 'min']
const durations = [1, 2, 4]
const labels = ['chord:', 'type:', 'duration:']
export const stringLetters = ['e', 'B', 'G', 'D', 'A', 'E']

export const tabPresets = {
    '0': {
        '0': [0, 2, 2, 2, 0, null],
        '1': [0, 1, 2, 2, 0, null]
    },
    '5': {
        '0': [2, 3, 2, 0, null, null],
        '1': [1, 3, 2, 0, null, null],
    },
    '3': {
        '0': [0, 1, 0, 2, 3, null]
    },
    '10': {
        '0': [3, 0, 0, 0, 2, 3]
    }
}

export const tabTemplates = {
    '0': [0, 0, 1, 2, 2, 0], // E major
    '1': [0, 0, 0, 2, 2, 0]  // E minor
}

class Chord {
    chord = -1;
    type = 0;
    duration = 1;
}

class Data {
    chords = [new Chord()];
    title;

    getData() {
        this.title = titleInput.value
        const copy = structuredClone(this)
        copy.chords.pop()
        return copy
    }

    setData(song) {
        this.title = song.title
        titleInput.value = song.title
        this.chords = song.chords
        displayEditor()
    }
}

export const data = new Data()

const divisionWidth = 230;
const rowHeight = 160;
const editorWidth = editor.clientWidth;
const selectorOffset = -15;
const linesHeight = 80;
const labelOffset = 30;
const numberOffset = (linesHeight / 5) / 2;
const numberFontSize = 16;

const divisionsPerRow = Math.floor(editorWidth / divisionWidth)

function chordPositionPx(position) {
    return Math.floor(divisionWidth / 5) * (1 + position + Math.floor(position / 4))
}

export function getTabNumbers({chord, type}) {
    if (tabPresets[chord] && tabPresets[chord][type]) {
        return tabPresets[chord][type]
    }

    return tabTemplates[type].map(number => 
        (number + chord - 7 + chordLetters.length) % 
            (chord >= 7 ? chordLetters.length : 1000))
}

function chordNumbers(position, index) {
    const root = document.createElement('div')
    root.className = 'chordNumbers'
    root.style.height = `${linesHeight}px`
    root.style.left = `${chordPositionPx(position)}px`
    const numbers = getTabNumbers(data.chords[index])
    for (let i = 0; i < 6; i++) {
        if (numbers[i] === null) {
            continue;
        }
        const chordNumber = document.createElement('div')
        chordNumber.className = 'chordNumber'
        chordNumber.style.top = `${(i * linesHeight / 5) - numberOffset}px`
        chordNumber.innerText = numbers[i]
        root.appendChild(chordNumber);
    }
    return root
}

function getHandler(property, index) {
    return (e) => {
        data.chords[index][property] = Number(e.target.value);
        displayEditor()
    } 
}

function chordEditor(position, index) { // position - missing notes
    const root = document.createElement('div')
    root.className = 'chordEditor'
    root.style.top = '0'
    root.style.left = `${chordPositionPx(position) + selectorOffset}px`

    const letterSelector = document.createElement('select')
    letterSelector.className = 'selector'
    
    const option = document.createElement('option')
    option.value = '-1'
    option.innerText = '?'
    letterSelector.appendChild(option)
    
    chordLetters.forEach((letter, index) => {
        const option = document.createElement('option')
        option.value = index
        option.innerText = letter
        letterSelector.appendChild(option)
    })


    letterSelector.value = data.chords[index].chord
    
    letterSelector.onchange = getHandler('chord', index)

    const typeSelector = document.createElement('select')
    typeSelector.className = 'selector'

    chordTypes.forEach((type, index) => {
        const option = document.createElement('option')
        option.value = index
        option.innerText = type
        typeSelector.appendChild(option)
    })    

    typeSelector.value = data.chords[index].type
    typeSelector.onchange = getHandler('type', index)

    const durationSelector = document.createElement('select')
    durationSelector.className = 'selector'

    durations.forEach(duration => {
        const option = document.createElement('option')
        option.value = duration
        option.innerText = duration
        durationSelector.appendChild(option)
    })

    durationSelector.value = data.chords[index].duration
    durationSelector.onchange = getHandler('duration', index)

    root.appendChild(letterSelector)
    root.appendChild(typeSelector)
    root.appendChild(durationSelector)
    
    return root
}

function RowLines() {
    const root = document.createElement('div')
    root.className = 'lines'
    root.style.height = `${linesHeight}px`
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div')
        line.className = 'line'
        line.style.top = `${i * linesHeight / 5}px`
        line.style.width = `${divisionWidth * divisionsPerRow}px`
        root.appendChild(line);
    }
    for (let i = 0; i < divisionsPerRow + 1; i++) {
        const divisionSeparator = document.createElement('div')
        divisionSeparator.className = 'divisionSeparator'
        divisionSeparator.style.left = `${i * divisionWidth}px`
        root.appendChild(divisionSeparator)
    }
    return root;
}

function Row(offset, startIndex, endIndex) {
    const root = document.createElement('div')
    root.className = 'row'
    root.style.height = `${rowHeight}px`

    labels.forEach((label, index) => {
        const labelElem = document.createElement('div')
        labelElem.className = 'label'
        labelElem.style.top = `${index * labelOffset + 5}px`
        labelElem.innerText = label
        root.appendChild(labelElem)
    })

    stringLetters.forEach((letter, index) => {
        const letterElem = document.createElement('div')
        letterElem.className = 'stringLetter'
        letterElem.style.bottom = `${((5 - index) * linesHeight / 5) - numberOffset - 2}px`
        letterElem.innerText = letter
        root.appendChild(letterElem)
    })

    const rowLines = RowLines()
    root.appendChild(rowLines)
    
    for (let i = startIndex; i <= endIndex; i++) {
        root.appendChild(chordEditor(offset, i))
        if (data.chords[i].chord !== -1) {
            root.appendChild(chordNumbers(offset, i))    
        }
        offset += data.chords[i].duration
    }

    return root
}

export function displayEditor() {
    editor.innerHTML = ''
    for (let i = data.chords.length - 1; i >= 0; i--) {
        if (data.chords[i].chord === -1) {
            data.chords.splice(i, 1)
        }
    }
    data.chords.push(new Chord())

    resetLine();

    let offset = 0, startIndex = 0, startOffset = 0;
    const totalPositions = divisionsPerRow * 4
    for (let i = 0; i < data.chords.length; i++) {
        offset += data.chords[i].duration
        if (offset >= totalPositions) {
            editor.appendChild(Row(startOffset, startIndex, i))
            offset -= totalPositions;
            startOffset = offset;
            startIndex = i + 1;
        }
    }
    if (startIndex < data.chords.length) {
        editor.appendChild(Row(startOffset, startIndex, data.chords.length - 1))
    }
}

let playButton = document.getElementById('play');
let stopButton = document.getElementById('stop');
let verticalLine = document.createElement('div');
let isPlaying = false;

verticalLine.className = 'verticalLine';



function playChord(chord) {
    if (chord.chord !== -1) {
        console.log(`Playing chord: ${chordLetters[chord.chord]} ${chordTypes[chord.type]}`);
    if(chord.type==1){
        const notes=[chord.chord, (chord.chord + 3) % 12, (chord.chord + 7) % 12].sort((a,b)=>a-b);
        setTimeout(() => playNote(chordLetters[notes[0]]), 0);
            setTimeout(() => playNote(chordLetters[notes[1]]), 25);
            setTimeout(() => playNote(chordLetters[notes[2]]), 50);
            setTimeout(() => playNote(chordLetters[chord.chord].concat("4")), 75);
    }
    if(chord.type==0){
        const notes=[chord.chord, (chord.chord + 4) % 12, (chord.chord + 7) % 12].sort((a,b)=>a-b);
        setTimeout(() => playNote(chordLetters[notes[0]]), 0);
            setTimeout(() => playNote(chordLetters[notes[1]]), 25);
            setTimeout(() => playNote(chordLetters[notes[2]]), 50);
            setTimeout(() => playNote(chordLetters[chord.chord].concat("4")), 75);
    }
    }
}

function playNote(note) {
      const audioElement = document.getElementById(`${note}`);
      audioElement.loop=false;
      var myClonedAudio = audioElement.cloneNode();

      myClonedAudio.play();
  }



function startPlayback(){
    if (isPlaying) return;
    isPlaying=true;
    setSelectorsDisabled(true);
    playerId=setInterval(moveLine, 500);
}

function resetLine() {
    currentTickIndex = 0;
    currentRowIndex = -1;
    verticalLine.style.display='none';
    tick = 0;
    totalChordsIndex=0;
}
function stopPlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(playerId);
    playerId=null;
    setSelectorsDisabled(false);
}


let currentTickIndex=0;
let currentRowIndex=-1;
let tick=0;
let currentRow;
let playerId = null;
let totalChordsIndex=0;

function moveLine(){
    if (totalChordsIndex===data.chords.length) {
        stopPlayback();
        resetLine();
        return;
    }

    if(currentRowIndex===-1||currentTickIndex>=divisionsPerRow*4){
        currentRowIndex++;
        currentRow = editor.children[currentRowIndex];
        currentRow.appendChild(verticalLine);
        currentTickIndex=0;
    }

    verticalLine.style.top = `${rowHeight-90}px`;
    verticalLine.style.left = `${chordPositionPx(currentTickIndex)}px`;
    verticalLine.style.display='block';

    if(tick==0){
        const currentChord=data.chords[totalChordsIndex]
        playChord(currentChord);
        totalChordsIndex++;
        tick=currentChord.duration;
    }
    tick--;
    currentTickIndex++;
}


function setSelectorsDisabled(disabled) {
    const selectors = document.querySelectorAll('.selector');
    selectors.forEach(selector => {
        selector.disabled = disabled;
    });
}


playButton.onclick = startPlayback;
stopButton.onclick = stopPlayback;
