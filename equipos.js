document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://api.football-data.org/v4/competitions/PD/teams";
    //id = 2224
    const API_KEY = "ab01fa4ad8034df2954929c867163eb8";

    try {
        const response = await fetch(API_URL, {
            headers: {
                "X-Auth-Token": API_KEY
            }
        });
        const data = await response.json();
        const teams = data.teams.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar equipos alfabéticamente
        const teamsContainer = document.getElementById("teams-container");

        const positionCategories = {
            "Porteros": ["Goalkeeper"],
            "Defensas": ["Defence", "Centre-Back", "Right-Back", "Left-Back"],
            "Centrocampistas": ["Defensive Midfield", "Central Midfield", "Midfield", "Attacking Midfield"],
            "Delanteros": ["Right Winger", "Left Winger", "Centre-Forward", "Offence"]
        };

        teams.forEach(team => {
            const teamCard = document.createElement("div");
            teamCard.className = "team-card";

            // Contenedor principal dividido en dos columnas (izquierda y derecha)
            const teamContainer = document.createElement("div");
            teamContainer.className = "team-container";

            // Columna izquierda: Logo, nombre y fundación
            const teamLeft = document.createElement("div");
            teamLeft.className = "team-left";

            const crestImg = document.createElement("img");
            crestImg.src = team.crest;
            crestImg.alt = `${team.name} Logo`;

            const teamName = document.createElement("h3");
            teamName.className = "team-name";
            teamName.innerHTML = `<strong>${team.name}</strong>`;

            const teamInfo = document.createElement("p");
            teamInfo.className = "team-info";
            teamInfo.textContent = `Fundación: ${team.founded}`;

            // Añadir los elementos a la columna izquierda
            teamLeft.appendChild(crestImg);
            teamLeft.appendChild(teamName);
            teamLeft.appendChild(teamInfo);

            // Columna derecha: Nombre del estadio y su imagen
            const stadiumInfo = document.createElement("div");
            stadiumInfo.className = "stadium-info";
            stadiumInfo.innerHTML = `
                <p>${team.venue}</p>
                <img src="img/stadiums/${team.venue.toLowerCase().replace(/ /g, '_')}.png" alt="${team.venue}">
            `;

            // Añadir las columnas al contenedor principal
            teamContainer.appendChild(teamLeft);
            teamContainer.appendChild(stadiumInfo);

            // Añadir el contenedor principal a la tarjeta del equipo
            teamCard.appendChild(teamContainer);

            // Contenedor de la plantilla
            const squadContainer = document.createElement("div");
            squadContainer.className = "squad-container";

            // Añadir el entrenador al principio de la lista
            const coachDiv = document.createElement("div");
            coachDiv.className = "coach";
            coachDiv.innerHTML = `<h3>Entrenador: ${team.coach ? team.coach.name : "No disponible"}</h3>`;
            squadContainer.appendChild(coachDiv);

            // Crear listas para cada categoría de posición
            Object.entries(positionCategories).forEach(([category, positions]) => {
                // Crear el título de la categoría
                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category;
                squadContainer.appendChild(categoryTitle);

                // Crear la lista (ul)
                const ul = document.createElement("ul");

                // Filtrar y ordenar jugadores por posición
                positions.forEach(position => {
                    team.squad.filter(player => player.position === position).forEach(player => {
                        // Crear un elemento de lista (li) para cada jugador
                        const li = document.createElement("li");
                        li.textContent = player.name;

                        // Añadir el jugador a la lista
                        ul.appendChild(li);
                    });
                });

                // Añadir la lista al contenedor
                squadContainer.appendChild(ul);
            });

            // Añadir el contenedor de la plantilla al final de la tarjeta del equipo
            teamCard.appendChild(squadContainer);
            teamsContainer.appendChild(teamCard);
        });
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
    }
});
