// 10 Trivia Questions with Image Links
const questions = [
    {
       question: "Who is the immortal ruler of mankind seated on the Golden Throne?",

image: "https://veizla.github.io/Veizla/images/golden-throne.jpg",

options: ["Horus Lupercal", "The Emperor of Mankind", "Roboute Guilliman", "Malcador the Sigillite"],

answer: "The Emperor of Mankind"

}, {

question: "Which Chaos God is the deity of plague and decay?",

image: "https://example.com/chaos-gods.jpg",

options: ["Khorne", "Tzeentch", "Nurgle", "Slaanesh"],

answer: "Nurgle"

}, {

question: "What are the Emperor’s genetically-engineered super-soldiers called?",

image: "https://example.com/space-marines.jpg",

options: ["Adeptus Custodes", "Primarchs", "Space Marines", "Imperial Guard"],

answer: "Space Marines"

}, {

question: "Which ancient alien race uses necrodermis bodies and once dominated the galaxy?",

image: "https://example.com/necron-warrior.jpg",

options: ["Eldar", "Necrons", "Tau", "Orks"],

answer: "Necrons"

}, {

question: "What is the name of the psychic realm used for faster-than-light travel?",

image: "https://example.com/warp-storm.jpg",

options: ["The Webway", "The Warp", "The Void", "The Astronomican"],

answer: "The Warp"

}, {

question: "Which Space Marine Chapter is known for its black armor and hatred of mutants?",

image: "https://example.com/black-templars.jpg",

options: ["Black Templars", "Dark Angels", "Blood Angels", "Space Wolves"],

answer: "Black Templars"

}, {

question: "What event marked the end of the Great Crusade and the rise of Chaos?",

image: "https://example.com/horus-heresy.jpg",

options: ["The Horus Heresy", "The Fall of Cadia", "The Great Rift", "The Age of Apostasy"],

answer: "The Horus Heresy"

}, {

question: "Which Imperial organization hunts down heretics with ruthless zeal?",

image: "https://example.com/inquisition-seal.jpg",

options: ["Adeptus Mechanicus", "Inquisition", "Ecclesiarchy", "Astra Militarum"],

answer: "Inquisition"

}, {

question: "What are the massive, junk-built war machines of the Orks called?",

image: "https://example.com/ork-gargant.jpg",

options: ["Gargants", "Baneblades", "Titans", "Dreadnoughts"],

answer: "Gargants"

}, {

question: "Which primarch was resurrected to lead the Imperium in the 41st millennium?",

image: "https://example.com/primarch-guilliman.jpg",

options: ["Sanguinius", "Rogal Dorn", "Roboute Guilliman", "Lion El’Jonson"],

answer: "Roboute Guilliman"
    }
];

let currentQuestion = 0;
let score = 0;
let playerName = "";
let playerEmail = "";
let leaderboard = [];

// Sign-up form submission
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    playerName = document.getElementById("name").value;
    playerEmail = document.getElementById("email").value;
    document.getElementById("start-page").style.display = "none";
    document.getElementById("game-page").style.display = "block";
    loadQuestion();
    fetchLeaderboard(); // Fetch leaderboard on start
    const music = document.getElementById("background-music");
    music.play().catch(error => console.log("Autoplay blocked:", error));
    document.getElementById("music-toggle").textContent = "Pause Music";
});

// Load question (unchanged)
function loadQuestion() { /* ... */ }

// Check answer (unchanged)
function checkAnswer(selected, correct) { /* ... */ }

// End game
function endGame() {
    document.getElementById("game-page").style.display = "none";
    document.getElementById("end-page").style.display = "block";
    document.getElementById("final-score").textContent = score;
    sendToGoogleSheet(playerName, playerEmail, score).then(fetchLeaderboard); // Update leaderboard after sending
}

// Fetch leaderboard from Google Sheet
function fetchLeaderboard() {
    fetch("https://script.google.com/macros/s/AKfycby8ooOWRgq_EVJfnDQuX2EDo738KfP1DG0Po78g0Eufw-I7zw5WM_kXvSuXqWF4XBzjjw/exec", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        leaderboard = data;
        leaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
        updateLeaderboardDisplay();
    })
    .catch(error => console.log("Error fetching leaderboard:", error));
}

// Update leaderboard display
function updateLeaderboardDisplay() {
    const lb = document.getElementById("leaderboard");
    lb.innerHTML = "";
    leaderboard.slice(0, 5).forEach((entry, i) => {
        lb.innerHTML += `<p>${i + 1}. ${entry.name} - ${entry.score}</p>`;
    });
}

// Send data to Google Sheet
function sendToGoogleSheet(name, email, score) {
    const data = { name, email, score, date: new Date().toISOString() };
    return fetch("https://script.google.com/macros/s/AKfycby8ooOWRgq_EVJfnDQuX2EDo738KfP1DG0Po78g0Eufw-I7zw5WM_kXvSuXqWF4XBzjjw/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }).then(() => console.log("Data sent to Google Sheet"));
}

// Music control (unchanged)
const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
musicToggle.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "Pause Music";
    } else {
        music.pause();
        musicToggle.textContent = "Play Music";
    }
});

// Initial leaderboard fetch
fetchLeaderboard();