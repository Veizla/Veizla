// 10 Warhammer 40K Trivia Questions with Image Links
const questions = [
    {
        question: "Who is the immortal ruler of mankind seated on the Golden Throne?",
        image: "https://veizla.github.io/Veizla/images/golden-throne.jpg",
        options: ["Horus Lupercal", "The Emperor of Mankind", "Roboute Guilliman", "Malcador the Sigillite"],
        answer: "The Emperor of Mankind"
    },
    {
        question: "Which Chaos God is the deity of plague and decay?",
        image: "https://veizla.github.io/Veizla/images/Chaos_gods.webp",
        options: ["Khorne", "Tzeentch", "Nurgle", "Slaanesh"],
        answer: "Nurgle"
    },
    {
        question: "What are the Emperor’s genetically-engineered super-soldiers called?",
        image: "https://veizla.github.io/Veizla/images/40k-imperial-faction-header.jpg",
        options: ["Adeptus Custodes", "Adeptus Mechanicus", "Space Marines", "Astra Militarum"],
        answer: "Space Marines"
    },
    {
        question: "Which ancient alien race uses necrodermis bodies and once dominated the galaxy?",
        image: "https://veizla.github.io/Veizla/images/episode-235-banner.jpg",
        options: ["Eldar", "Necrons", "Tau", "Orks"],
        answer: "Necrons"
    },
    {
        question: "What is the name of the psychic realm used for faster-than-light travel?",
        image: "https://veizla.github.io/Veizla/images/Iron_Hands_Fleet_Arrives.webp",
        options: ["The Webway", "The Warp", "The Void", "The Astronomican"],
        answer: "The Warp"
    },
    {
        question: "Which Space Marine Chapter is known for its black armor and hatred of mutants?",
        image: "https://veizla.github.io/Veizla/images/warhammer-40k-space-marine-chapters-legions.jpg",
        options: ["Black Templars", "Dark Angels", "Blood Angels", "Space Wolves"],
        answer: "Black Templars"
    },
    {
        question: "What event marked the end of the Great Crusade and the rise of Chaos?",
        image: "https://veizla.github.io/Veizla/images/dawn-of-the-great-crusade-pony-version-by-stdeadra-v0-zy9970t2orfd1.webp",
        options: ["The Horus Heresy", "The Fall of Cadia", "The Great Rift", "The Age of Apostasy"],
        answer: "The Horus Heresy"
    },
    {
        question: "Which Imperial organization hunts down heretics with ruthless zeal?",
        image: "https://veizla.github.io/Veizla/images/40k-imperium-factions-guide-adeptus-custodes.jpg",
        options: ["Adeptus Mechanicus", "Inquisition", "Ecclesiarchy", "Astra Militarum"],
        answer: "Inquisition"
    },
    {
        question: "What are the massive, junk-built war machines of the Orks called?",
        image: "https://veizla.github.io/Veizla/images/Imperator_Titan_vs_Ork_Mega-Gargant.webp",
        options: ["Gargants", "Baneblades", "Titans", "Dreadnoughts"],
        answer: "Gargants"
    },
    {
        question: "Which primarch was resurrected to lead the Imperium in the 41st millennium?",
        image: "https://veizla.github.io/Veizla/images/The_Primarchs.webp",
        options: ["Sanguinius", "Rogal Dorn", "Roboute Guilliman", "Lion El’Jonson"],
        answer: "Roboute Guilliman"
    }
];

let currentQuestion = 0;
let score = 0;
let playerName = "";
let playerEmail = "";
let leaderboard = [];
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDl6-pDThjTxbZfrLjABqexYPrM63lrcqmp-vjn7nl_hoPhEj9mig9Oiu8LI40yEp44w/exec";

document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    playerName = document.getElementById("name").value;
    playerEmail = document.getElementById("email").value;
    document.getElementById("start-page").style.display = "none";
    document.getElementById("game-page").style.display = "block";
    loadQuestion();
    fetchLeaderboard();
    const music = document.getElementById("background-music");
    music.volume = 0.7; // Set initial volume to 70%
    music.play().catch(error => console.log("Autoplay blocked:", error));
    document.getElementById("music-toggle").textContent = "Pause Music";
    document.getElementById("volume-slider").value = 70; // Sync slider to 70%
});

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

function checkAnswer(selected, correct) {
    if (selected === correct) score++;
    currentQuestion++;
    loadQuestion();
}

function endGame() {
    document.getElementById("game-page").style.display = "none";
    document.getElementById("end-page").style.display = "block";
    document.getElementById("final-score").textContent = score;
    sendToGoogleSheet(playerName, playerEmail, score).then(() => fetchLeaderboard());
}

function fetchLeaderboard() {
    fetch(GOOGLE_SCRIPT_URL, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Leaderboard data:", data);
        leaderboard = data;
        leaderboard.sort((a, b) => b.score - a.score);
        updateLeaderboardDisplay();
    })
    .catch(error => console.error("Error fetching leaderboard:", error));
}

function updateLeaderboardDisplay() {
    const lb = document.getElementById("leaderboard");
    lb.innerHTML = "";
    leaderboard.slice(0, 5).forEach((entry, i) => {
        lb.innerHTML += `<p>${i + 1}. ${entry.name} - ${entry.score}</p>`;
    });
}

function sendToGoogleSheet(name, email, score) {
    const data = new URLSearchParams({
        name: name,
        email: email,
        score: score,
        date: new Date().toISOString()
    });
    return fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        console.log("Data sent to Google Sheet:", { name, email, score });
        return response.text();
    })
    .catch(error => console.error("Error sending to Google Sheet:", error));
}

const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const volumeSlider = document.getElementById("volume-slider");

// Set initial volume to 70%
music.volume = 0.7;
volumeSlider.value = 70; // Sync slider with initial volume

// Toggle music play/pause
musicToggle.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = "Pause Music";
    } else {
        music.pause();
        musicToggle.textContent = "Play Music";
    }
});

// Adjust volume with slider
volumeSlider.addEventListener("input", () => {
    music.volume = volumeSlider.value / 100; // Convert 0-100 range to 0.0-1.0
});

fetchLeaderboard();