document.getElementById('joinTournamentForm').addEventListener('submit', async function(event) {
  event.preventDefault();


  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  const tournamentUid = document.getElementById('tournamentUid').value;

  const data = {
    name,
    role,
    uid,
    tournamentUid
  };

  try {
    // TODO: update url
    const response = await fetch('http://localhost:8080/joinTournament', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.joined) {
      document.getElementById('response').innerHTML = '<p>You have successfully joined the tournament.</p>';
      const enterButton = document.getElementById('enterTournamentBtn');
      enterButton.style.display = 'block';

      enterButton.addEventListener('click', function() {
        if (role === 'mod') {
          window.location.href = 'mod.html';
        } else if (role === 'player') {
          window.location.href = 'player.html';
        }
      });

      document.getElementById("userForm").style.display = "none";
      } else {
      document.getElementById('response').innerHTML = '<p>Failed to join the tournament. Please try again.</p>';
      document.getElementById('enterTournamentBtn').style.display = 'none';
    }
  } catch (error) {
    document.getElementById('response').innerHTML = '<p>Error connecting to the server. Please try again.</p>';
    console.error('Error:', error);
  }
});
