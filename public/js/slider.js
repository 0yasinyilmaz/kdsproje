function initializeHomeSlider() {
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let slideInterval;
    const slideWidth = slider.offsetWidth;
    slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.flex = '0 0 auto';
    });

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function startAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 5000);
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
            startAutoSlide();
        });
    });
    slider.addEventListener('mouseenter', () => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    });

    slider.addEventListener('mouseleave', startAutoSlide);
    window.addEventListener('resize', () => {
        const newWidth = slider.offsetWidth;
        slides.forEach(slide => {
            slide.style.width = `${newWidth}px`;
        });
        updateSlider();
    });
    updateSlider();
    startAutoSlide();
}

function initializeSlider() {
    const slides = document.querySelectorAll('.slide img');
    
    slides.forEach(img => {
        img.onload = function() {
            if (this.naturalWidth < 800) {
                console.warn('Görsel çözünürlüğü düşük:', this.src);
            }
        };

        img.onerror = function() {
            console.error('Görsel yüklenemedi:', this.src);
            this.src = '/slider/placeholder.png';
        };
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync');
    });
}
document.addEventListener('DOMContentLoaded', initializeSlider); 