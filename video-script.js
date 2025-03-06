// script.js
import { debounce } from 'lodash-es';

// Type definitions
/** @typedef {{id: number, title: string, faction1: string, faction2: string, country: string, players: string[], tournament: string, thumbnail: string, videoUrl: string, featured: boolean}} Match */

const API_KEY = 'AIzaSyAkPPBTU2zLcHMp8PzMmMxH8kJRRDAODJY'; // Replace with your actual API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// DOM Elements
const elements = {
    searchInput: /** @type {HTMLInputElement} */ (document.getElementById("searchInput")),
    factionFilter: /** @type {HTMLSelectElement} */ (document.getElementById("factionFilter")),
    countryFilter: /** @type {HTMLSelectElement} */ (document.getElementById("countryFilter")),
    playerFilter: /** @type {HTMLSelectElement} */ (document.getElementById("playerFilter")),
    tournamentFilter: /** @type {HTMLSelectElement} */ (document.getElementById("tournamentFilter")),
    matchGrid: /** @type {HTMLDivElement} */ (document.getElementById("matchGrid")),
    featuredMatch: /** @type {HTMLDivElement} */ (document.getElementById("featuredMatch"))
};

/** @type {Match[]} */
let matches = [];

/** Fetch matches from YouTube API */
async function fetchMatches() {
    try {
        // Step 1: Search for Warhammer 40k matches
        const searchUrl = `${BASE_URL}/search?part=snippet&q=warhammer+40k+match+tournament&type=video&maxResults=50&key=${API_KEY}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.items) throw new Error('No videos found');

        // Step 2: Extract video IDs
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Step 3: Get detailed video metadata
        const videosUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();

        // Step 4: Parse and structure data
        matches = videosData.items.map((video, index) => {
            const title = video.snippet.title;
            // Basic parsing - you'll need to refine this based on title patterns
            const factions = parseFactionsFromTitle(title);
            const players = parsePlayersFromTitle(title);
            const tournament = parseTournamentFromTitle(title) || 'Unknown Tournament';

            return {
                id: index + 1,
                title,
                faction1: factions[0] || 'Unknown',
                faction2: factions[1] || 'Unknown',
                country: 'Unknown', // YouTube API doesn't provide this directly
                players: players.length ? players : ['Player 1', 'Player 2'],
                tournament,
                thumbnail: video.snippet.thumbnails.high.url,
                videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
                featured: index === 0 // Make the first video featured
            };
        });

        return matches;
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
}

/** Placeholder parsing functions - customize these */
function parseFactionsFromTitle(title) {
    // Example: "Chaos Space Marines vs Orks - Tournament X"
    const vsIndex = title.toLowerCase().indexOf('vs');
    if (vsIndex === -1) return ['Unknown', 'Unknown'];
    const parts = title.split('vs').map(part => part.trim());
    return [parts[0], parts[1]?.split('-')[0].trim() || 'Unknown'];
}

function parsePlayersFromTitle(title) {
    // Extract player names if present in format like "(John vs Mike)"
    const playerMatch = title.match(/\(([^)]+)\)/);
    return playerMatch ? playerMatch[1].split('vs').map(p => p.trim()) : [];
}

function parseTournamentFromTitle(title) {
    const parts = title.split('-');
    return parts.length > 1 ? parts[1].trim() : null;
}

/** Initialize application */
async function initializeApp() {
    matches = await fetchMatches();
    await populateFilters();
    displayFeaturedMatch();
    displayMatchGrid();
    setupEventListeners();
}

/** Populate filter dropdowns */
async function populateFilters() {
    const factions = [...new Set(matches.flatMap(m => [m.faction1, m.faction2]))];
    const countries = [...new Set(matches.map(m => m.country))];
    const players = [...new Set(matches.flatMap(m => m.players))];
    const tournaments = [...new Set(matches.map(m => m.tournament))];

    populateSelect(elements.factionFilter, factions);
    populateSelect(elements.countryFilter, countries);
    populateSelect(elements.playerFilter, players);
    populateSelect(elements.tournamentFilter, tournaments);
}

/** @param {HTMLSelectElement} select @param {string[]} options */
function populateSelect(select, options) {
    select.innerHTML = '<option value="">All</option>' + 
        options.map(option => `<option value="${option}">${option}</option>`).join('');
}

/** Display featured match */
function displayFeaturedMatch() {
    const featured = matches.find(m => m.featured);
    if (!featured) return;

    elements.featuredMatch.style.backgroundImage = `url(${featured.thumbnail})`;
    elements.featuredMatch.innerHTML = `
        <h2>${featured.title}</h2>
        <p>Players: ${featured.players.join(" vs ")}</p>
        <p>Tournament: ${featured.tournament}</p>
        <p>Country: ${featured.country}</p>
        <button data-url="${featured.videoUrl}">Watch Now</button>
    `;
}

/** @param {Match[]} [filteredMatches] */
function displayMatchGrid(filteredMatches = matches) {
    elements.matchGrid.innerHTML = filteredMatches.map(match => `
        <div class="match-card" data-url="${match.videoUrl}">
            <img src="${match.thumbnail}" alt="${match.title}" loading="lazy">
            <div class="match-info">
                <h3>${match.title}</h3>
                <p>Players: ${match.players.join(" vs ")}</p>
                <p>Tournament: ${match.tournament}</p>
            </div>
        </div>
    `).join('');
}

/** Search and filter matches */
const searchMatches = debounce(() => {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const filters = {
        faction: elements.factionFilter.value,
        country: elements.countryFilter.value,
        player: elements.playerFilter.value,
        tournament: elements.tournamentFilter.value
    };

    const filteredMatches = matches.filter(match => {
        const searchMatch = !searchTerm || 
            match.title.toLowerCase().includes(searchTerm) ||
            match.players.some(p => p.toLowerCase().includes(searchTerm)) ||
            match.tournament.toLowerCase().includes(searchTerm);

        return searchMatch &&
            (!filters.faction || [match.faction1, match.faction2].includes(filters.faction)) &&
            (!filters.country || match.country === filters.country) &&
            (!filters.player || match.players.includes(filters.player)) &&
            (!filters.tournament || match.tournament === filters.tournament);
    });

    displayMatchGrid(filteredMatches);
}, 300);

/** Setup event listeners */
function setupEventListeners() {
    elements.searchInput.addEventListener('input', searchMatches);
    [elements.factionFilter, elements.countryFilter, elements.playerFilter, elements.tournamentFilter]
        .forEach(el => el.addEventListener('change', searchMatches));
    
    document.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (target.matches('.match-card, .match-card *')) {
            const url = target.closest('.match-card')?.dataset.url;
            if (url) window.open(url, '_blank');
        }
        if (target.matches('button[data-url]')) {
            window.open(target.dataset.url, '_blank');
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', initializeApp);