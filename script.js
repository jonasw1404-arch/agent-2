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

    // Wenn das Viewport-Verhältnis breiter ist als 16:9, wird die Höhe die limitierende Größe.
    if (viewportWidth / viewportHeight > aspectRatio) {
        // Querformatiger als 16:9 -> Bildbreite auf 100% setzen
        img.style.width = '100vw';
        img.style.height = 'auto';
    } else {
        // Hochformatiger als 16:9 -> Bildhöhe auf 100% setzen
        img.style.width = 'auto';
        img.style.height = '100vh';
    }

    // Stellen Sie sicher, dass das Bild zentriert bleibt
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%)';
}

// --- Funktion zur Audio-Wiedergabe ---
function tryToPlayAudio() {
    const audio = document.getElementById('agent-audio');
    if (audio) {
        // Der Browser erfordert oft eine Benutzerinteraktion (Klick), um Audio abzuspielen.
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio erfolgreich gestartet
            }).catch(error => {
                // Wenn Auto-Play fehlschlägt, warten auf Klick-Interaktion
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

    // Keys mit den korrekten Antworten abgleichen
    for (const [key, value] of Object.entries(CORRECT_KEYS)) {
        const submittedValue = formData.get(key).trim();
        // Bereinigung für robusten Abgleich: Groß-/Kleinschreibung ignorieren, Leerzeichen/Sonderzeichen entfernen
        const cleanSubmitted = submittedValue.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCorrect = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const inputElement = document.getElementById(key);

        if (cleanSubmitted !== cleanCorrect) {
            allCorrect = false;
            inputElement.style.borderColor = '#ff0000'; // Rot bei Fehler
            inputElement.placeholder = "FEHLERHAFT";
        } else {
            inputElement.style.borderColor = '#4CAF50'; // Grün bei Erfolg
            inputElement.placeholder = "IDENTIFIZIERT";
        }
    }

    const resultDisplay = document.getElementById('result-display');
    const finalName = document.getElementById('final-name');
    const headerH2 = document.querySelector('#terminal-sidebar h2');
    const submitButton = document.getElementById('submit-keys');

    if (allCorrect) {
        finalName.textContent = `TARGET: ${FINAL_NAME}`;
        headerH2.innerHTML = '<span class="status-success">AUTORISIERUNG ERTEILT</span>';
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ ZIEL IDENTIFIZIERT ]';
        submitButton.disabled = true;
        submitButton.textContent = 'ZUGRIFF GEWÄHRT';
        submitButton.style.backgroundColor = '#4CAF50';
    } else {
        finalName.textContent = "VERARBEITUNGSFEHLER! ERNEUT VERSUCHEN.";
        headerH2.innerHTML = '<span class="status-warning">AUTORISIERUNG AUSSTEHEND</span>';
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ FEHLERMELDUNG ]';
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
