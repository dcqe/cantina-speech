// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
            finalTranscript += text;
        } else {
            interimTranscript += text;
        }
    }

    const transcriptionElement = document.getElementById('transcription');
    //new interim and final transcriptions in two lines
    transcriptionElement.innerHTML = `<div  class="interim">${interimTranscript}</div ><div  class="final">${finalTranscript}</div >`;
};

recognition.onend = () => {
    // Restart the recognition when it ends
    recognition.start();
};

recognition.start();

recognition.onstart = () => {
    const logElem = document.getElementById('transcription');
    logElem.innerHTML = `<div class="log">recognition started</div >`;
}