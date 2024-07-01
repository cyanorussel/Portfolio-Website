const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 120);
})

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('active');
};
window.onscroll = () => {
    menu.classList.remove('bx-x');
    navllist.classList.remove('active');
};
document.getElementById('downloadBtn').addEventListener('click', function () {
    // Path to the file to be downloaded
    const fileUrl = 'RESUME.pdf';
    // Name of the file after download
    const fileName = 'AnmolsResume.pdf';

    // Create an invisible anchor element
    const a = document.createElement('a');
    a.href = fileUrl;
    a.setAttribute('download', fileName);

    // Append the anchor to the body
    document.body.appendChild(a);

    // Trigger the download
    a.click();

    // Remove the anchor from the body
    document.body.removeChild(a);
});

const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots-container');
const dots = [];

let currentIndex = 0;
let intervalId = null;
let isDragging = false;
let startX = 0;
let startTranslate = 0;

// Create dots and add click event listeners
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dots.push(dot);
    dotsContainer.appendChild(dot);
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Automatic sliding interval
function startSlider() {
    intervalId = setInterval(() => {
        showSlide(currentIndex + 1);
    }, 3000); // Adjust slide duration as needed (e.g., 3000ms = 3 seconds)
}

// Start automatic sliding
startSlider();

// Event listeners for mouse events
slidesContainer.addEventListener('mousedown', dragStart);
slidesContainer.addEventListener('mousemove', drag);
slidesContainer.addEventListener('mouseup', dragEnd);
slidesContainer.addEventListener('mouseleave', dragEnd);

// Event listeners for touch events
slidesContainer.addEventListener('touchstart', dragStart);
slidesContainer.addEventListener('touchmove', drag);
slidesContainer.addEventListener('touchend', dragEnd);

function dragStart(event) {
    // Only start dragging if left mouse button is clicked
    if (event.type === 'mousedown' && event.button !== 0) return;

    isDragging = true;
    startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    startTranslate = getTranslateX();
    clearInterval(intervalId); // Stop automatic sliding on drag
    slidesContainer.style.transition = 'none'; // Disable transition during drag
}

function drag(event) {
    if (!isDragging) return;
    const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const diff = startX - currentX;
    setTranslateX(startTranslate - diff);
}

function dragEnd(event) {
    if (!isDragging) return;
    isDragging = false;

    const slideWidth = slides[0].clientWidth;
    const threshold = slideWidth * 0.02; // 2% of slide width

    const currentTranslateX = getTranslateX();
    const diff = startTranslate - currentTranslateX;

    slidesContainer.style.transition = 'transform 0.5s ease'; // Re-enable transition

    if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < slides.length - 1) {
            showSlide(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
            showSlide(currentIndex - 1);
        } else {
            showSlide(currentIndex);
        }
    } else {
        showSlide(currentIndex);
    }

    startSlider(); // Resume automatic sliding after drag ends
}

function getTranslateX() {
    const style = window.getComputedStyle(slidesContainer);
    const transform = style.transform || style.webkitTransform;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m41;
}

function setTranslateX(x) {
    slidesContainer.style.transform = `translateX(${x}px)`;
}

function showSlide(index) {
    const slideWidth = slides[0].clientWidth;
    const maxIndex = slides.length - 1;

    if (index < 0) {
        index = maxIndex;
    } else if (index > maxIndex) {
        index = 0;
    }

    const targetTranslateX = -index * slideWidth;
    slidesContainer.style.transform = `translateX(${targetTranslateX}px)`;

    // Update dots
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');

    currentIndex = index;
}



