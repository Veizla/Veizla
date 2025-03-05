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

// Leaderboard (sample data)
let leaderboard = [
    { name: "Player1", score: 8 },
    { name: "Player2", score: 6 }
];

// Sign-up form submission
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    playerName = document.getElementById("name").value;
    playerEmail = document.getElementById("email").value;
    document.getElementById("start-page").style.display = "none";
    document.getElementById("game-page").style.display = "block";
    loadQuestion();
    updateLeaderboardDisplay();
// Start music automatically after form submission
    const music = document.getElementById("background-music");
    music.play().catch(error => {
        console.log("Autoplay blocked by browser:", error);
        // If autoplay fails, the toggle button can still start it
    });
    document.getElementById("music-toggle").textContent = "Pause Music";
});

// Load question
function loadQuestion() {
    if (currentQuestion >= 10) {
        endGame();
        return;
    }
    const q = questions[currentQuestion];
    document.getElementById("question-number").textContent = currentQuestion + 1;
    document.getElementById("question-text").textContent = q.question;
    const img = document.getElementById("question-image");
    if (q.image) {
        img.src = q.image;
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, q.answer);
        optionsDiv.appendChild(btn);
    });
    document.getElementById("score").textContent = score;
}

// Check answer
function checkAnswer(selected, correct) {
    if (selected === correct) score++;
    currentQuestion++;
    loadQuestion();
}

// End game
function endGame() {
    document.getElementById("game-page").style.display = "none";
    document.getElementById("end-page").style.display = "block";
    document.getElementById("final-score").textContent = score;
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    sendToGoogleSheet(playerName, playerEmail, score);
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
    fetch("https://docs.google.com/spreadsheets/d/1A7eJItgsTf99RJx3Nh07qR0FGIUsfx4ox4gv42OPNaY/edit?gid=0#gid=0", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }).then(() => console.log("Data sent to Google Sheet"));
}

// Music control
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

// Initial leaderboard display
updateLeaderboardDisplay();