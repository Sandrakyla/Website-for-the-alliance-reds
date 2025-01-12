document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Проверяем, ведет ли ссылка на якорь (начинается с #)
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Если ссылка ведет на другую страницу, переход произойдет как обычно
    });
});

let currentPhotoIndex = 0;
let photos = [];

// Открыть модальное окно с фотографиями
function openModal(photoArray) {
    photos = photoArray;
    currentPhotoIndex = 0;
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = photos[currentPhotoIndex];
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => {
        modal.style.display = "none";
        modal.style.animation = "";
    }, 300);
}

// Переключение между фотографиями
function changePhoto(direction) {
    currentPhotoIndex += direction;
    if (currentPhotoIndex >= photos.length) {
        currentPhotoIndex = 0;
    } else if (currentPhotoIndex < 0) {
        currentPhotoIndex = photos.length - 1;
    }
    document.getElementById("modalImg").src = photos[currentPhotoIndex];
}

// Закрытие модального окна при клике вне изображения
window.onclick = function (event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        closeModal();
    }
};