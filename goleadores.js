// URL de la API
const apiURL = "https://api.football-data.org/v4/competitions/PD/scorers";

// Tu API Key
const API_KEY = "ab01fa4ad8034df2954929c867163eb8";

// Hacer la solicitud a la API
fetch(apiURL, {
    method: "GET",
    headers: {
        "X-Auth-Token": API_KEY
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
})
.then(data => {
    // Función para llenar la tabla con los datos de los goleadores
    populateScorersTable(data.scorers);
})
.catch(error => {
    console.error("There was a problem with the fetch operation:", error);
});

// Función para llenar la tabla con los datos de los goleadores
function populateScorersTable(scorers) {
    const tableBody = document.querySelector("#standings-table tbody");

    scorers.sort((a, b) => {
        if (b.goals === a.goals) {
            return b.assists - a.assists; // Ordenar por asistencias si hay empate en goles
        }
        return b.goals - a.goals; // Ordenar por goles
    });

    scorers.forEach((scorer, index) => {
        // Crear una nueva fila
        const row = document.createElement("tr");

        // Crear y llenar las celdas de la fila
        const positionCell = document.createElement("td");
        positionCell.textContent = index + 1; // Posición (1, 2, 3, ...)

        // Crear y llenar las celdas de la fila
        const playerNameCell = document.createElement("td");

        // Crear el elemento de imagen para el crest
        const Img = document.createElement("img");
        Img.src = scorer.team.crest; // URL del crest
        Img.alt = scorer.team.name + " crest"; // Texto alternativo

        // Añadir el crest y el nombre del jugador a la celda
        playerNameCell.appendChild(Img);
        playerNameCell.appendChild(document.createTextNode(` ${scorer.player.name}`));

        const goalsCell = document.createElement("td");
        goalsCell.textContent = scorer.goals;

        const assistsCell = document.createElement("td");
        assistsCell.textContent = scorer.assists || 0;

        const penaltiesCell = document.createElement("td");
        penaltiesCell.textContent = scorer.penalties || 0;

        const matchesPlayedCell = document.createElement("td");
        matchesPlayedCell.textContent = scorer.playedMatches;

        // Añadir celdas a la fila
        row.appendChild(positionCell);
        row.appendChild(playerNameCell);
        row.appendChild(goalsCell);
        row.appendChild(assistsCell);
        row.appendChild(penaltiesCell);
        row.appendChild(matchesPlayedCell);

        // Añadir la fila a la tabla
        tableBody.appendChild(row);
    });
}