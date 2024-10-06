document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const role = document.getElementById('role').value;
  const name = document.getElementById('name').value;

  const data = {
    role: role,
    name: name
  };

  try {
    // TODO: update to actual url
    const response = await fetch('http://localhost:8080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    // Display the response data
    // document.getElementById('response').innerHTML = `
    //   <p><strong>Role:</strong> ${responseData.role}</p>
    //   <p><strong>Name:</strong> ${responseData.name}</p>
    //   <p><strong>UID:</strong> ${responseData.uid}</p>
    // `;

    localStorage.setItem('name', responseData.name);
    localStorage.setItem('role', responseData.role);
    localStorage.setItem('uid', responseData.uid);

    if (responseData.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'jointournament.html';
    }
  } catch (error) {
    document.getElementById('response').innerHTML = `<p>Error sending data to the backend.</p>`;
    console.error('Error:', error);
  }
});
