document
  .getElementById("tournamentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const uid = localStorage.getItem("uid");

    const numPlayers = document.getElementById("numPlayers").value;
    const numMods = document.getElementById("numMods").value;
    const tournamentName = document.getElementById("tournamentName").value;

    const data = {
      name,
      role,
      uid,
      numPlayers,
      numMods,
      tournamentName,
    };

    try {
      // TODO: update url
      const response = await fetch(
        "http://localhost:8080/createTournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      document.getElementById("response").innerHTML = `
      <p><strong>Tournament Name:</strong> ${responseData.tournamentName}</p>
      <p><strong>Number of Players:</strong> ${responseData.numPlayers}</p>
      <p><strong>Number of Mods:</strong> ${responseData.numMods}</p>
      <p><strong>Tournament TID:</strong> ${responseData.tid}</p>
    `;

      if (responseData.uid) {
        document.getElementById("startTournamentBtn").style.display = "block";
        document.getElementById("tournamentForm").style.display = "none";
      }
    } catch (error) {
      document.getElementById(
        "response"
      ).innerHTML = `<p>Error creating tournament. Please try again.</p>`;
      console.error("Error:", error);
    }
  });
