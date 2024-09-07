document.addEventListener("DOMContentLoaded", async () => {
    const STANDINGS_API_URL = "https://api.football-data.org/v4/competitions/PD/standings";
    const API_KEY = "ab01fa4ad8034df2954929c867163eb8";

    async function fetchAndDisplayStandings() {
        try {
            const response = await fetch(STANDINGS_API_URL, {
                headers: {
                    "X-Auth-Token": API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const standings = data.standings[0].table;

            const standingsTableBody = document.querySelector("#standings-table tbody");

            standings.forEach(teamData => {
                const row = document.createElement("tr");

                // Posición
                const positionCell = document.createElement("td");
                positionCell.textContent = teamData.position;

                // Asignar colores según la posición
                if (teamData.position >= 1 && teamData.position <= 4) {
                    positionCell.style.backgroundColor = "#1e88e5";
                } else if (teamData.position === 5 || teamData.position === 6) {
                    positionCell.style.backgroundColor = "#fdd835";
                } else if (teamData.position === 7) {
                    positionCell.style.backgroundColor = "#fb8c00";
                } else if (teamData.position >= 18 && teamData.position <= 20) {
                    positionCell.style.backgroundColor = "#e53935";
                }

                row.appendChild(positionCell);

                // Equipo (Escudo y nombre)
                const teamCell = document.createElement("td");
                const teamLogo = document.createElement("img");
                teamLogo.src = teamData.team.crest;
                teamLogo.alt = `${teamData.team.name} Logo`;
                teamLogo.style.height = "30px"; // Ajusta el tamaño del escudo si es necesario
                teamLogo.style.marginRight = "10px"; // Espacio entre logo y nombre
                teamCell.appendChild(teamLogo);
                const teamName = document.createTextNode(teamData.team.name);
                teamCell.appendChild(teamName);
                row.appendChild(teamCell);

                // Puntos
                const pointsCell = document.createElement("td");
                pointsCell.textContent = teamData.points;
                row.appendChild(pointsCell);

                // Partidos Jugados
                const playedGamesCell = document.createElement("td");
                playedGamesCell.textContent = teamData.playedGames;
                row.appendChild(playedGamesCell);

                // Partidos Ganados
                const wonCell = document.createElement("td");
                wonCell.textContent = teamData.won;
                row.appendChild(wonCell);

                // Partidos Empatados
                const drawCell = document.createElement("td");
                drawCell.textContent = teamData.draw;
                row.appendChild(drawCell);

                // Partidos Perdidos
                const lostCell = document.createElement("td");
                lostCell.textContent = teamData.lost;
                row.appendChild(lostCell);

                // Goles a Favor
                const goalsForCell = document.createElement("td");
                goalsForCell.textContent = teamData.goalsFor;
                row.appendChild(goalsForCell);

                // Goles en Contra
                const goalsAgainstCell = document.createElement("td");
                goalsAgainstCell.textContent = teamData.goalsAgainst;
                row.appendChild(goalsAgainstCell);

                // Diferencia de Goles
                const goalDifferenceCell = document.createElement("td");
                goalDifferenceCell.textContent = teamData.goalDifference;
                row.appendChild(goalDifferenceCell);

                // Añadir la fila a la tabla
                standingsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al obtener la clasificación:", error);
        }
    }

    fetchAndDisplayStandings();
});
