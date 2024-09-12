document.addEventListener("DOMContentLoaded", async () => {
    const MATCHES_API_URL = "https://api.football-data.org/v4/competitions/PD/matches";
    const STANDINGS_API_URL = "https://api.football-data.org/v4/competitions/PD/standings";
    const SCORERS_API_URL = "https://api.football-data.org/v4/competitions/PD/scorers";
    const API_KEY = "ab01fa4ad8034df2954929c867163eb8";

    async function fetchAndDisplayData() {
        try {
            // Obtener la clasificación (incluye currentMatchday)
            const responseStandings = await fetch(STANDINGS_API_URL, {
                headers: { "X-Auth-Token": API_KEY }
            });
            if (!responseStandings.ok) throw new Error(`HTTP error! status: ${responseStandings.status}`);
            const standingsData = await responseStandings.json();

            // Extraer la jornada actual desde standings
            const currentMatchday = standingsData.season.currentMatchday;

            // Mostrar la clasificación
            displayStandings(standingsData);

            // Obtener los partidos de la jornada actual
            const responseMatches = await fetch(MATCHES_API_URL, {
                headers: { "X-Auth-Token": API_KEY }
            });

            if (!responseMatches.ok) throw new Error(`HTTP error! status: ${responseMatches.status}`);
            const matchesData = await responseMatches.json();
            
            // Filtrar los partidos de la jornada actual
            const currentMatchdayMatches = matchesData.matches.filter(match => match.matchday === currentMatchday);

            // Mostrar la jornada actual
            displayCurrentMatchday(currentMatchday, currentMatchdayMatches);

            // Obtener y mostrar la tabla de goleadores
            const responseScorers = await fetch(SCORERS_API_URL, {
                headers: { "X-Auth-Token": API_KEY }
            });
            if (!responseScorers.ok) throw new Error(`HTTP error! status: ${responseScorers.status}`);
            const scorersData = await responseScorers.json();
            
            // Mostrar los goleadores
            displayScorers(scorersData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function displayCurrentMatchday(matchday, matches) {
        const matchdayContainer = document.querySelector(".matchday-container");
        
        // Crear un título para la próxima jornada
        const matchdayTitle = document.createElement("h2");
        matchdayTitle.textContent = `Jornada actual (Jornada ${matchday})`;
        matchdayContainer.appendChild(matchdayTitle);

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
        matches.forEach(match => {
            const row = document.createElement("tr");

            // Equipo local
            const homeTeamCell = document.createElement("td");
            homeTeamCell.innerHTML = `<img src="${match.homeTeam.crest}" alt="${match.homeTeam.name}"> ${match.homeTeam.name}`;

            // Equipo visitante
            const awayTeamCell = document.createElement("td");
            awayTeamCell.innerHTML = `<img src="${match.awayTeam.crest}" alt="${match.awayTeam.name}"> ${match.awayTeam.name}`;

            // Resultado del partido
            const resultCell = document.createElement("td");
            resultCell.textContent = `${match.score.fullTime.home ?? '-'} - ${match.score.fullTime.away ?? '-'}`;

            // Horario del partido
            const dateCell = document.createElement("td");
            const matchDate = new Date(match.utcDate);
            dateCell.textContent = `${matchDate.toLocaleDateString()} ${matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // Determinar el color de fondo para los equipos según el resultado
            if (match.score.fullTime.home !== null && match.score.fullTime.away !== null) {
                if (match.score.fullTime.home > match.score.fullTime.away) {
                    // Equipo local ganó
                    homeTeamCell.style.backgroundColor = "#d4edda";  // Verde suave
                    awayTeamCell.style.backgroundColor = "#f8d7da";  // Rojo suave
                } else if (match.score.fullTime.home < match.score.fullTime.away) {
                    // Equipo visitante ganó
                    homeTeamCell.style.backgroundColor = "#f8d7da";  // Rojo suave
                    awayTeamCell.style.backgroundColor = "#d4edda";  // Verde suave
                } else {
                    // Empate
                    homeTeamCell.style.backgroundColor = "#fff3cd";  // Amarillo suave
                    awayTeamCell.style.backgroundColor = "#fff3cd";  // Amarillo suave
                }
            }

            // Agregar las celdas a la fila
            row.appendChild(homeTeamCell);
            row.appendChild(resultCell);
            row.appendChild(awayTeamCell);
            row.appendChild(dateCell);

            // Agregar la fila al cuerpo de la tabla
            tbody.appendChild(row);
        });

        matchdayContainer.appendChild(table);
    }

    async function displayStandings() {
        try {
            const response = await fetch(STANDINGS_API_URL, {
                headers: { "X-Auth-Token": API_KEY }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const standings = data.standings[0].table;

            // Crear tabla dentro de standings-container
            const standingsContainer = document.querySelector(".standings-container");

            const table = document.createElement("table");
            table.setAttribute("id", "standings-table");

            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const headers = [
                "Pos", "Equipo", "Pts", "PJ", 
                "PG", "PE", "PP", "GF", "GC", "DG"
            ];

            headers.forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            table.appendChild(tbody);

            // Añadir la tabla al contenedor
            standingsContainer.appendChild(table);

            // Llenar la tabla con datos de la clasificación
            standings.forEach(teamData => {
                const row = document.createElement("tr");

                // Posición
                const positionCell = document.createElement("td");
                positionCell.textContent = teamData.position;

                // Asignar colores según la posición
                if (teamData.position >= 1 && teamData.position <= 4) {
                    positionCell.style.backgroundColor = "#1e88e5"; // Azul para posiciones 1 a 4
                } else if (teamData.position === 5 || teamData.position === 6) {
                    positionCell.style.backgroundColor = "#fdd835"; // Amarillo para posiciones 5 y 6
                } else if (teamData.position === 7) {
                    positionCell.style.backgroundColor = "#fb8c00"; // Naranja para posición 7
                } else if (teamData.position >= 18 && teamData.position <= 20) {
                    positionCell.style.backgroundColor = "#e53935"; // Rojo para posiciones 18 a 20
                }

                row.appendChild(positionCell);

                // Equipo (Escudo y nombre)
                const teamCell = document.createElement("td");
                const teamLogo = document.createElement("img");
                teamLogo.src = teamData.team.crest;
                teamLogo.alt = `${teamData.team.name} Logo`;
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
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error("Error al obtener la clasificación:", error);
        }
    }

    function displayScorers(data) {
        const scorers = data.scorers;
    
        // Seleccionar el contenedor de los goleadores
        const scorersContainer = document.querySelector(".scorers-container");
    
        // Crear la tabla
        const table = document.createElement("table");
        table.id = "scorers-table";
    
        // Crear el encabezado de la tabla
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = ["Pos", "Jugador", "G", "A", "P", "PJ"];
    
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        // Crear el cuerpo de la tabla
        const tbody = document.createElement("tbody");
    
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
            Img.style.height = "30px"; // Ajustar el tamaño del escudo
            Img.style.marginRight = "10px"; // Espacio entre el escudo y el nombre
    
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
    
            // Añadir la fila al cuerpo de la tabla
            tbody.appendChild(row);
        });
    
        // Añadir el cuerpo de la tabla a la tabla
        table.appendChild(tbody);
    
        // Limpiar el contenedor antes de agregar la nueva tabla (si es necesario)
        scorersContainer.innerHTML = '';
    
        // Añadir la tabla al contenedor
        scorersContainer.appendChild(table);
    }

    fetchAndDisplayData();
});