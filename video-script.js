// script.js
// Sample match data (in reality, this would come from a database or YouTube API)
const matches = [
    {
        id: 1,
        title: "Chaos Space Marines vs Orks",
        faction1: "Chaos Space Marines",
        faction2: "Orks",
        country: "USA",
        players: ["John Doe", "Mike Smith"],
        tournament: "Grand Tournament 2025",
        thumbnail: "https://img.youtube.com/vi/sample1/hqdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=sample1",
        featured: true
    },
    // Add more match objects here
];

function initializeApp() {
    populateFilters();
    displayFeaturedMatch();
    displayMatchGrid();
}

function populateFilters() {
    const factions = [...new Set(matches.flatMap(m => [m.faction1, m.faction2]))];
    const countries = [...new Set(matches.map(m => m.country))];
    const players = [...new Set(matches.flatMap(m => m.players))];
    const tournaments = [...new Set(matches.map(m => m.tournament))];

    populateSelect("factionFilter", factions);
    populateSelect("countryFilter", countries);
    populateSelect("playerFilter", players);
    populateSelect("tournamentFilter", tournaments);
}

function populateSelect(elementId, options) {
    const select = document.getElementById(elementId);
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function displayFeaturedMatch() {
    const featured = matches.find(m => m.featured);
    if (!featured) return;

    const featuredDiv = document.getElementById("featuredMatch");
    featuredDiv.style.backgroundImage = `url(${featured.thumbnail})`;
    featuredDiv.innerHTML = `
        <h2>${featured.title}</h2>
        <p>Players: ${featured.players.join(" vs ")}</p>
        <p>Tournament: ${featured.tournament}</p>
        <p>Country: ${featured.country}</p>
        <button onclick="window.open('${featured.videoUrl}', '_blank')">Watch Now</button>
    `;
}

function displayMatchGrid(filteredMatches = matches) {
    const grid = document.getElementById("matchGrid");
    grid.innerHTML = "";

    filteredMatches.forEach(match => {
        const card = document.createElement("div");
        card.className = "match-card";
        card.innerHTML = `
            <img src="${match.thumbnail}" alt="${match.title}">
            <div class="match-info">
                <h3>${match.title}</h3>
                <p>Players: ${match.players.join(" vs ")}</p>
                <p>Tournament: ${match.tournament}</p>
            </div>
        `;
        card.onclick = () => window.open(match.videoUrl, "_blank");
        grid.appendChild(card);
    });
}

function searchMatches() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const factionFilter = document.getElementById("factionFilter").value;
    const countryFilter = document.getElementById("countryFilter").value;
    const playerFilter = document.getElementById("playerFilter").value;
    const tournamentFilter = document.getElementById("tournamentFilter").value;

    const filteredMatches = matches.filter(match => {
        const searchMatch = searchTerm === "" || 
            match.title.toLowerCase().includes(searchTerm) ||
            match.players.some(p => p.toLowerCase().includes(searchTerm)) ||
            match.tournament.toLowerCase().includes(searchTerm);

        return searchMatch &&
            (!factionFilter || match.faction1 === factionFilter || match.faction2 === factionFilter) &&
            (!countryFilter || match.country === countryFilter) &&
            (!playerFilter || match.players.includes(playerFilter)) &&
            (!tournamentFilter || match.tournament === tournamentFilter);
    });

    displayMatchGrid(filteredMatches);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", initializeApp);

// Add event listeners for filter changes
["factionFilter", "countryFilter", "playerFilter", "tournamentFilter"].forEach(id => {
    document.getElementById(id).addEventListener("change", searchMatches);
});