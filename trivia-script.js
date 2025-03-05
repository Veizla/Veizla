// 10 Trivia Questions with Image Links
const questions = [
    {
        question: "What is the capital of France?",
        image: "https://example.com/france.jpg",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        image: "",
        options: ["Mars", "Jupiter", "Venus", "Saturn"],
        answer: "Mars"
    },
    {
        question: "Who painted the Mona Lisa?",
        image: "https://example.com/mona-lisa.jpg",
        options: ["Van Gogh", "Da Vinci", "Picasso", "Monet"],
        answer: "Da Vinci"
    },
    {
        question: "What is the largest ocean on Earth?",
        image: "",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: "Pacific"
    },
    {
        question: "Which element has the symbol 'O'?",
        image: "https://example.com/oxygen.jpg",
        options: ["Gold", "Oxygen", "Osmium", "Ozone"],
        answer: "Oxygen"
    },
    {
        question: "What year did the Titanic sink?",
        image: "",
        options: ["1912", "1905", "1920", "1898"],
        answer: "1912"
    },
    {
        question: "Which animal is known as the King of the Jungle?",
        image: "https://example.com/lion.jpg",
        options: ["Tiger", "Elephant", "Lion", "Bear"],
        answer: "Lion"
    },
    {
        question: "What is the smallest country by land area?",
        image: "",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        answer: "Vatican City"
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        image: "https://example.com/shakespeare.jpg",
        options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
        answer: "Shakespeare"
    },
    {
        question: "What gas do plants use for photosynthesis?",
        image: "",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: "Carbon Dioxide"
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
    fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
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