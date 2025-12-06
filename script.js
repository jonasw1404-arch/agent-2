// Konfigurierbare Agenten-Daten
// Die Keys sind nun alle '1' für den Test, wie gewünscht
const CORRECT_KEYS = {
    key1: "1",
    key2: "1",
    key3: "1",
    key4: "1",
    key5: "1"
};

const FINAL_NAME = "TARGET: MAX MUSTERMANN"; // Neutraler Name
const keysValidated = {
    key1: false,
    key2: false,
    key3: false,
    key4: false,
    key5: false
};

// --- FUNKTIONEN ZUR VALIDIERUNG UND STATUS-UPDATE ---

/**
 * Validiert einen einzelnen Schlüssel und aktualisiert das Feedback.
 * @param {string} keyId - Die ID des Input-Elements (z.B. 'key1').
 * @param {string} correctValue - Der korrekte Wert für diesen Schlüssel.
 */
function validateSingleKey(keyId, correctValue) {
    const inputElement = document.getElementById(keyId);
    const feedbackElement = document.getElementById(`feedback-${keyId}`);
    const submittedValue = inputElement.value.trim();
    const successColor = '#27AE60'; 
    const failureColor = '#E74C3C'; 

    if (submittedValue === correctValue) {
        // Erfolg
        keysValidated[keyId] = true;
        inputElement.style.borderColor = successColor;
        inputElement.disabled = true; // Sperrt das Feld nach Erfolg
        feedbackElement.textContent = `[SUCCESS] ${keyId.toUpperCase()} VALIDATED. DATA SECURED.`;
        feedbackElement.style.color = successColor;
        return true;
    } else {
        // Fehler
        keysValidated[keyId] = false;
        inputElement.style.borderColor = failureColor;
        feedbackElement.textContent = `[ERROR] ${keyId.toUpperCase()} INVALID. CHECK SOURCE.`;
        feedbackElement.style.color = failureColor;
        return false;
    }
}

/**
 * Überprüft, ob alle 5 Schlüssel erfolgreich validiert wurden.
 */
function checkFinalStatus() {
    const allCorrect = Object.values(keysValidated).every(isValid => isValid === true);
    const finalStatusElement = document.getElementById('final-status');
    const finalNameElement = document.getElementById('final-name');
    const statusBar = document.querySelector('.status-bar span');
    const successColor = '#27AE60'; 

    if (allCorrect) {
        // Finale Identifizierung erfolgreich
        finalStatusElement.textContent = 'VALIDIERUNG ERFOLGREICH. FINALER TRACE BEGONNEN.';
        finalStatusElement.style.color = successColor;
        
        // Simuliert einen kurzen Ladevorgang, bevor der Name erscheint
        setTimeout(() => {
            finalNameElement.textContent = FINAL_NAME;
            finalNameElement.classList.remove('status-neutral');
            finalNameElement.classList.add('status-success');
            
            statusBar.textContent = 'PROTOCOL COMPLETE';
            statusBar.style.color = successColor;
        }, 1000);
        
    } else {
        // Warten auf weitere Validierungen
        finalStatusElement.textContent = `Validierung ausstehend. ${Object.values(keysValidated).filter(v => v).length} von 5 Codes gesichert.`;
        finalStatusElement.style.color = '#6C7A89';
        finalNameElement.textContent = '';
        finalNameElement.classList.add('status-neutral');
    }
}

// --- INITIALISIERUNG UND EVENT-LISTENER ---

function initializeForms() {
    // Finde alle Formulare, die die Klasse 'key-form' haben
    const forms = document.querySelectorAll('.key-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Der Button enthält die nötigen Daten über Data-Attribute
            const button = form.querySelector('button');
            const keyId = button.getAttribute('data-key');
            const correctValue = CORRECT_KEYS[keyId];

            // 1. Einzelnen Schlüssel validieren
            validateSingleKey(keyId, correctValue);
            
            // 2. Gesamtstatus prüfen und UI aktualisieren
            checkFinalStatus();
        });
    });
}

// --- STANDARD-FUNKTIONEN (Unverändert) ---

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

function tryToPlayAudio() {
    const audio = document.getElementById('agent-audio');
    if (audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
                document.body.addEventListener('click', () => {
                    audio.play().catch(e => console.error("Audio-Wiedergabe fehlgeschlagen:", e));
                }, { once: true });
            });
        }
    }
}

// --- Initialisierung beim Laden der Seite ---
window.onload = () => {
    adjustBackgroundImage();
    window.addEventListener('resize', adjustBackgroundImage);
    tryToPlayAudio();
    initializeForms(); // Startet die Event-Listener für die 5 Formulare
};
