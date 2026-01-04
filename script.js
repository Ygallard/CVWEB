// Funcionalidad de Modo Oscuro y Cambio de Idioma
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MODO OSCURO =====
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    // ===== CAMBIO DE IDIOMA =====
    const languageToggle = document.getElementById('language-toggle');
    const langText = languageToggle.querySelector('.lang-text');
    
    // Cargar idioma guardado
    let currentLang = localStorage.getItem('language') || 'es';
    updateLanguage(currentLang);
    
    languageToggle.addEventListener('click', function() {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('language', currentLang);
        updateLanguage(currentLang);
    });
    
    function updateLanguage(lang) {
        // Actualizar botón
        langText.textContent = lang === 'es' ? 'EN' : 'ES';
        
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = lang === 'es' ? 'es' : 'en';
        
        // Actualizar todos los elementos con data-es y data-en
        const elements = document.querySelectorAll('[data-es][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Si el elemento tiene hijos (como <strong> o <span>), preservar su estructura
                if (element.children.length > 0 && element.tagName !== 'P' && element.tagName !== 'LI') {
                    element.textContent = text;
                } else {
                    // Para elementos que pueden tener contenido HTML mixto
                    const hasChildrenWithData = Array.from(element.children).some(child => 
                        child.hasAttribute('data-es') && child.hasAttribute('data-en')
                    );
                    
                    if (!hasChildrenWithData) {
                        element.textContent = text;
                    } else {
                        // Solo actualizar el nodo de texto directo, no los hijos
                        Array.from(element.childNodes).forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.textContent = '';
                            }
                        });
                    }
                }
            }
        });
    }
    
    // ===== ANIMACIONES AL HACER SCROLL =====
    // Animación de las barras de progreso de idiomas
    const observerOptions = {
        // Umbral bajo para que las secciones aparezcan apenas entren en viewport
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    // Fallback si IntersectionObserver no está disponible o no se dispara
    const showAllSections = () => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    };

    const observer = ('IntersectionObserver' in window)
        ? new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions)
        : null;

    // Observar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        if (observer) {
            observer.observe(section);
        }
    });

    // Si el observer no se dispara en 800ms, mostramos todo para evitar que quede oculto
    setTimeout(() => {
        showAllSections();
    }, 800);

    // Animación de entrada para las tarjetas de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Animación de las etiquetas de habilidades
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 50);
    });

    // Smooth scroll para enlaces internos (si los hubiera)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto parallax suave en el header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Animación de las barras de progreso de idiomas cuando son visibles
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    const width = progressFill.style.width;
                    progressFill.style.width = '0%';
                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 100);
                }
            }
        });
    }, observerOptions);

    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        progressObserver.observe(item);
    });

    // Efecto de escritura en el título (opcional)
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Comentar la siguiente línea si no quieres el efecto de escritura
        // typeWriter();
    }

    // Añadir clase de carga completada
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Imprimir información en consola
    console.log('%c¡Hola! 👋', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%c¿Interesado en mi trabajo? ¡Contáctame!', 'color: #6b7280; font-size: 14px;');
});

// Función para cambiar la foto de perfil (si se implementa carga de imagen)
function updateProfileImage(imageUrl) {
    const profileImg = document.querySelector('.profile-img img');
    if (profileImg) {
        profileImg.src = imageUrl;
    }
}

// Función para descargar el CV en PDF (requeriría una librería adicional)
function downloadPDF() {
    window.print();
}

// Event listener para el botón de descarga (si se añade)
const downloadButton = document.querySelector('.download-btn');
if (downloadButton) {
    downloadButton.addEventListener('click', downloadPDF);
}
