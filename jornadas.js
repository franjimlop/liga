document.addEventListener("DOMContentLoaded", async () => {
    const MATCHES_API_URL = "https://api.football-data.org/v4/competitions/PD/matches";
    const API_KEY = "ab01fa4ad8034df2954929c867163eb8";

    async function fetchAndDisplayMatches() {
        try {
            const response = await fetch(MATCHES_API_URL, {
                headers: {
                    "X-Auth-Token": API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const matches = data.matches;
            const container = document.querySelector("#matches-container");

            // Agrupar partidos por jornada
            const matchesByMatchday = matches.reduce((acc, match) => {
                if (!acc[match.matchday]) {
                    acc[match.matchday] = [];
                }
                acc[match.matchday].push(match);
                return acc;
            }, {});

            // Crear contenedor para agrupar jornadas
            const matchdaysGroupContainer = document.createElement("div");
            matchdaysGroupContainer.classList.add("matchdays-group");

            let counter = 0;

            for (const matchday in matchesByMatchday) {
                const matchdayMatches = matchesByMatchday[matchday];

                // Crear un contenedor para la jornada
                const matchdayContainer = document.createElement("div");
                matchdayContainer.classList.add("matchday-container");

                // Crear un título para la jornada
                const matchdayTitle = document.createElement("h2");
                matchdayTitle.textContent = `Jornada ${matchday}`;
                matchdayContainer.appendChild(matchdayTitle);

                // Crear la tabla
                const table = document.createElement("table");
                const thead = document.createElement("thead");
                const tbody = document.createElement("tbody");

                const headerRow = document.createElement("tr");
                const headers = ["Local", "Resultado", "Visitante", "Horario"];
                headers.forEach(headerText => {
                    const th = document.createElement("th");
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);
                table.appendChild(tbody);

                // Crear filas de partidos
                matchdayMatches.forEach(match => {
                    const row = document.createElement("tr");

                    const homeTeamCell = document.createElement("td");
                    homeTeamCell.innerHTML = `<img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}" style="height: 30px; margin-right: 10px;"> ${match.homeTeam.name}`;

                    const resultCell = document.createElement("td");
                    resultCell.textContent = `${match.score.fullTime.home ?? '-'} - ${match.score.fullTime.away ?? '-'}`;

                    const awayTeamCell = document.createElement("td");
                    awayTeamCell.innerHTML = `<img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}" style="height: 30px; margin-right: 10px;"> ${match.awayTeam.name}`;

                    const dateCell = document.createElement("td");
                    const matchDate = new Date(match.utcDate);
                    dateCell.textContent = `${matchDate.toLocaleDateString()} ${matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                    row.appendChild(homeTeamCell);
                    row.appendChild(resultCell);
                    row.appendChild(awayTeamCell);
                    row.appendChild(dateCell);

                    tbody.appendChild(row);
                });

                matchdayContainer.appendChild(table);
                matchdaysGroupContainer.appendChild(matchdayContainer);

                // Cada dos jornadas, añadir el grupo al contenedor principal
                counter++;
                if (counter % 2 === 0) {
                    container.appendChild(matchdaysGroupContainer.cloneNode(true)); // Clonar el grupo para evitar referencias
                    matchdaysGroupContainer.innerHTML = ""; // Limpiar el contenedor
                }
            }

            // Si hay una jornada sobrante (número impar), agregarla también
            if (counter % 2 !== 0) {
                container.appendChild(matchdaysGroupContainer);
            }

        } catch (error) {
            console.error("Error al obtener los partidos:", error);
        }
    }

    fetchAndDisplayMatches();
});