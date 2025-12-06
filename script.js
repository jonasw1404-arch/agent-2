// Konfigurierbare Agenten-Daten
const CORRECT_KEYS = {
    key1: "(212) 555-0199",
    key2: "The Blue Raven",
    key3: "10013",
    key4: "4X78",
    key5: "KING-S"
};

const FINAL_NAME = "AGENT [Ihr Name hier]"; // Ersetzen Sie dies durch Ihren Namen!

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

    for (const [key, value] of Object.entries(CORRECT_KEYS)) {
        const submittedValue = formData.get(key).trim();
        // Bereinigung für robusten Abgleich
        const cleanSubmitted = submittedValue.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCorrect = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const inputElement = document.getElementById(key);

        if (cleanSubmitted !== cleanCorrect) {
            allCorrect = false;
            inputElement.style.borderColor = '#e6522c'; // Rostrot bei Fehler
            inputElement.placeholder = "ERROR: CHECK SOURCE";
        } else {
            inputElement.style.borderColor = '#4CAF50'; // Gedämpftes Grün bei Erfolg
            inputElement.placeholder = "DATA VALIDATED";
        }
    }

    const resultDisplay = document.getElementById('result-display');
    const finalName = document.getElementById('final-name');
    const headerH2 = document.querySelector('#terminal-sidebar h2');
    const submitButton = document.getElementById('submit-keys');

    if (allCorrect) {
        finalName.textContent = `TARGET IDENTIFIED: ${FINAL_NAME}`;
        finalName.classList.remove('status-failure');
        finalName.classList.add('status-success');
        
        headerH2.innerHTML = '<span class="status-success">STATUS: ACCESS GRANTED</span>';
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ FINAL REPORT ]';
        
        submitButton.disabled = true;
        submitButton.textContent = 'TRACE COMPLETE';
        submitButton.style.backgroundColor = '#4CAF50'; // Grün
    } else {
        finalName.textContent = "WARNING! ONE OR MORE DATA POINTS ARE INVALID. RE-CHECK SOURCE.";
        finalName.classList.remove('status-success');
        finalName.classList.add('status-failure');
        
        headerH2.innerHTML = '<span class="status-failure">STATUS: TRACE FAILED</span>';
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ TRACE RESULT ]';
    }
}

// --- Initialisierung beim Laden der Seite ---
window.onload = () => {
    // 1. Hintergrundbild sofort anpassen und bei Größenänderung updaten
    adjustBackgroundImage();
    window.addEventListener('resize', adjustBackgroundImage);

    // 2. Audio-Wiedergabe versuchen
    tryToPlayAudio();

    // 3. Formular-Handler registrieren
    document.getElementById('key-submission-form').addEventListener('submit', checkSubmission);
};
