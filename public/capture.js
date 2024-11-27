const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const snapButton = document.querySelector("#iconSnapIMG");
const photo = document.querySelector("#photo");
const context = canvas.getContext('2d');
const token = localStorage.getItem('jwtToken');

function startup() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    }).then(stream => {
        video.srcObject = stream;
        video.width = 1920;
        video.height = 1080;
    }).catch(console.error);
}

snapButton.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");

    // Fetch user ID
    fetch('/api/findUserById', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Dodaj token JWT
        }
    })
        .then(response => response.json())
        .then(users => {
            const userId = users.id; // Get the latest user ID from the response
            if (userId) {
                console.log('Latest User ID:', userId);

                const pokemonImageData = {
                    image: dataURL,
                    uzytkownik_id: userId // Poprawione
                };

                fetch('/api/dataImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ pokemonImageData })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Dane zapisane:', data);
                        window.location.href = 'photo.html';
                    })
                    .catch(error => {
                        console.error('Błąd podczas zapisywania danych:', error);
                    });
            } else {
                console.error('Nie znaleziono ID użytkownika.');
            }
        })
        .catch(error => {
            console.error('Błąd podczas pobierania ID użytkownika:', error);
        });
});

// Przenieś ten kod poza funkcję snapButton
window.addEventListener('load', startup, false);
