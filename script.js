// Konfigurierbare Agenten-Daten
const CORRECT_KEYS = {
    key1: "(212) 555-0199",
    key2: "The Blue Raven",
    key3: "10013",
    key4: "4X78",
    key5: "KING-S"
};

const FINAL_NAME = "[Ihr Name hier]"; // Ersetzen Sie dies durch Ihren Namen!

// --- Funktion zur Hintergrundbild-Anpassung (Responsive 16:9) ---
function adjustBackgroundImage() {
    const img = document.getElementById('background-image');
    if (!img) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = 16 / 9; 

    if (viewportWidth / viewportHeight > aspectRatio) {
        img.style.width = '100vw';
        img.style.height = 'auto';
    } else {
        img.style.width = 'auto';
        img.style.height = '100vh';
    }

    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%)';
}

// --- Funktion zur Audio-Wiedergabe ---
function tryToPlayAudio() {
    const audio = document.getElementById('agent-audio');
    if (audio) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio erfolgreich gestartet
            }).catch(error => {
                // Fallback: Warten auf Benutzerinteraktion
                document.body.addEventListener('click', () => {
                    audio.play().catch(e => console.error("Audio-Wiedergabe fehlgeschlagen:", e));
                }, { once: true });
                console.warn("Auto-Play blockiert. Klicken Sie irgendwo, um die Musik zu starten.");
            });
        }
    }
}

// --- Funktion zur Rätselüberprüfung ---
function checkSubmission(event) {
    event.preventDefault(); 
    
    const form = document.getElementById('key-submission-form');
    const formData = new FormData(form);
    
    let allCorrect = true;
    const accentColor = '#3498DB'; // Blau
    const successColor = '#2ECC71'; // Grün
    const failureColor = '#E74C3C'; // Rot

    for (const [key, value] of Object.entries(CORRECT_KEYS)) {
        const submittedValue = formData.get(key).trim();
        const cleanSubmitted = submittedValue.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCorrect = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const inputElement = document.getElementById(key);

        if (cleanSubmitted !== cleanCorrect) {
            allCorrect = false;
            inputElement.style.borderColor = failureColor; 
            inputElement.placeholder = "DATA INVALID";
        } else {
            inputElement.style.borderColor = successColor; 
            inputElement.placeholder = "DATA VALIDATED";
        }
    }

    const resultDisplay = document.getElementById('result-display');
    const finalName = document.getElementById('final-name');
    const statusBar = document.querySelector('.status-bar span');
    const submitButton = document.getElementById('submit-keys');

    if (allCorrect) {
        finalName.textContent = `TARGET IDENTIFIED: ${FINAL_NAME}`;
        finalName.classList.remove('status-failure');
        finalName.classList.add('status-success');
        
        statusBar.textContent = 'PROTOCOL COMPLETE';
        statusBar.style.color = successColor;
        
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ FINAL REPORT ]';
        
        submitButton.disabled = true;
        submitButton.textContent = 'ACCESS GRANTED';
        submitButton.style.backgroundColor = successColor;
    } else {
        finalName.textContent = "VALIDATION FAILED. ONE OR MORE ENTRIES ARE INCORRECT.";
        finalName.classList.remove('status-success');
        finalName.classList.add('status-failure');
        
        statusBar.textContent = 'VALIDATION ERROR';
        statusBar.style.color = failureColor;
        
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ PROTOCOL RESULT ]';
    }
}

// --- Initialisierung beim Laden der Seite ---
window.onload = () => {
    adjustBackgroundImage();
    window.addEventListener('resize', adjustBackgroundImage);
    tryToPlayAudio();
    document.getElementById('key-submission-form').addEventListener('submit', checkSubmission);
};
