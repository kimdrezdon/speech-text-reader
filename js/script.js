// Speech synthesis

const main = document.querySelector('main');
const voicesSelect = document.getElementById('voices');
const rateSelect = document.getElementById('rate');
const textArea = document.getElementById('text');
const readBtn = document.getElementById('read');
const stopBtn = document.getElementById('stop');
const pauseBtn = document.getElementById('pause');
const toggleBtn = document.getElementById('toggle');
const closeBtn = document.getElementById('close');

// Store voices
let voices = [];

// Paused state
let paused = false;

// Initialize speech synthesis
const message = new SpeechSynthesisUtterance();

// Populate page with default speech boxes
data.forEach(createBox);

// Create speech boxes
function createBox(item) {
    const box = document.createElement('div');
    const { image, text } = item;
    box.className = 'box';
    box.innerHTML = `
        <img src=${image} alt=${text}>
        <p class='info'>${text}</p>`;
    box.addEventListener('click', () => {
        setTextMessage(text);
        speakText();

        // Add active effect
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), 800);
    });
    main.appendChild(box);
}

// Populate voice select menu with voice options
function getVoices() {
    voices = speechSynthesis.getVoices();

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.innerText = `${voice.name} ${voice.lang}`;
        voicesSelect.appendChild(option);
    });

    // Set voice select menu to value in local storage or to the first voice
    const selectedVoice =
        localStorage.getItem('voice') !== null
            ? localStorage.getItem('voice')
            : 'Alex';

    voicesSelect.value = selectedVoice;
    message.voice = voices.find(voice => voice.name === selectedVoice);

    // Initialize rate to value in local storage or 1
    const selectedRate =
        localStorage.getItem('rate') !== null
            ? localStorage.getItem('rate')
            : '1';

    rateSelect.value = selectedRate;
    message.rate = selectedRate;
}

// Set text
function setTextMessage(text) {
    message.text = text;
}

// Speak text
function speakText() {
    speechSynthesis.speak(message);
}

// Set voice
function setVoice(e) {
    message.voice = voices.find(voice => voice.name === e.target.value);
    localStorage.setItem('voice', e.target.value);
}

// Set rate
function setRate(e) {
    message.rate = e.target.value;
    localStorage.setItem('rate', e.target.value);
}

// Pause/Resume speaking text
function togglePauseResume() {
    if (speechSynthesis.speaking && !paused) {
        paused = true;
        speechSynthesis.pause();
        pauseBtn.innerText = 'Resume';
    } else if (paused) {
        paused = false;
        speechSynthesis.resume();
        pauseBtn.innerText = 'Pause';
    }
}

// Event listeners

// Toggle text box
toggleBtn.addEventListener('click', () =>
    document.getElementById('text-box').classList.toggle('show')
);

// Close text box
closeBtn.addEventListener('click', () =>
    document.getElementById('text-box').classList.toggle('show')
);

// Load list of voices. addEventListener didn't work for this in Safari
if ('onvoiceschanged' in speechSynthesis) {
    speechSynthesis.onvoiceschanged = getVoices;
} else {
    getVoices();
}

// Change voice
voicesSelect.addEventListener('change', setVoice);

// Change voice
rateSelect.addEventListener('change', setRate);

// Read text button
readBtn.addEventListener('click', () => {
    if (!speechSynthesis.speaking) {
        setTextMessage(textArea.value);
        speakText();
    }
});

// Stop reading text button
stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
});

// Pause button
pauseBtn.addEventListener('click', () => {
    togglePauseResume();
});
