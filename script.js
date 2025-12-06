// Konfigurierbare Agenten-Daten
const CORRECT_KEYS = {
    key1: "(212) 555-0199",
    key2: "The Blue Raven",
    key3: "10013",
    key4: "4X78",
    key5: "KING-S"
};

const FINAL_NAME = "AGENT [Ihr Name hier]"; // Ersetzen Sie dies durch Ihren Namen!

// --- Funktion zur Hintergrundbild-Anpassung ---
function adjustBackgroundImage() {
    const img = document.getElementById('background-image');
    if (!img) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = 16 / 9; // Das Verhältnis des Quellbildes

    // Logik: Wähle die Dimension, die das gesamte Fenster abdeckt.
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
        // Browser verlangen oft eine Benutzerinteraktion, um Audio abzuspielen.
        // Ein Klick-Event-Listener als Workaround
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Audio hat erfolgreich gestartet
            }).catch(error => {
                // Wenn Auto-Play fehlschlägt, warten auf Klick
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
    event.preventDefault(); // Verhindert das Neuladen der Seite
    
    const form = document.getElementById('key-submission-form');
    const formData = new FormData(form);
    
    let allCorrect = true;
    let feedback = [];

    // Keys mit den korrekten Antworten abgleichen
    for (const [key, value] of Object.entries(CORRECT_KEYS)) {
        const submittedValue = formData.get(key).trim();
        // Optionale Bereinigung: Groß-/Kleinschreibung ignorieren und unnötige Zeichen entfernen
        const cleanSubmitted = submittedValue.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCorrect = value.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (cleanSubmitted !== cleanCorrect) {
            allCorrect = false;
            // Kann hier Feedback hinzufügen, z.B. das Eingabefeld rot markieren
            document.getElementById(key).style.borderColor = 'red';
        } else {
            document.getElementById(key).style.borderColor = '#00ff7f'; // Grün bei Erfolg
        }
    }

    const resultDisplay = document.getElementById('result-display');
    const finalName = document.getElementById('final-name');

    if (allCorrect) {
        finalName.textContent = `*** ZIEL IDENTIFIZIERT: ${FINAL_NAME} ***`;
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ AUTORISIERUNG ERTEILT - AKTE OFFFEN ]';
        document.getElementById('submit-keys').disabled = true;
        document.getElementById('submit-keys').textContent = '// ZUGRIFF GEWÄHRT //';
    } else {
        finalName.textContent = "VERARBEITUNGSFEHLER! Mindestens ein Schlüssel-Datenpunkt ist INKORREKT. ERNEUT VERSUCHEN.";
        resultDisplay.style.display = 'block';
        resultDisplay.querySelector('h3').textContent = '[ AUTORISIERUNG AUSSTEHEND ]';
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
