// Build data from anchors inside #possiveisResults
const possibleContainer = document.getElementById('possiveisResults');
let data = [];
    const anchors = Array.from(possibleContainer.querySelectorAll('a'));
    data = anchors.map(a => ({
        name: (a.textContent || a.getAttribute('title') || a.id || a.getAttribute('href') || '').trim(),
        href: a.getAttribute('href')
    })).filter(item => item.name);


const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Inicialização do Swiper para o carrossel de biografias
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const biographiesSwiper = new Swiper('.biographies-swiper', {
            loop: true,
            spaceBetween: 30,
            slidesPerView: 1,
            slidesPerGroup: 1, // move um card por vez
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            navigation: {
                nextEl: '.bio-next',
                prevEl: '.bio-prev',
            },
        });
    } else {
        console.warn('Swiper não foi carregado. Certifique-se de incluir o script do Swiper.');
    }
});
const resultsDiv = document.getElementById('results');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário
    const searchTerm = searchInput.value.toLowerCase();
    filterData(searchTerm);
});

function filterData(term) {
    const filteredData = data.filter(item => {
        return item.name.toLowerCase().includes(term);
    });
    displayResults(filteredData);
}

function displayResults(results) {
    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }
        results.forEach(item => {
            if (item.href) {
                const a = document.createElement('a');
                a.href = item.href;
                a.className = 'block px-3 py-2 hover:bg-gray-100 rounded text-blue-600';
                a.textContent = item.name;
                // open in same tab
                a.addEventListener('click', () => hideResults());
                resultsDiv.appendChild(a);
            } else {
                const row = document.createElement('div');
                row.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer rounded';
                row.textContent = item.name;
                row.addEventListener('click', () => {
                    searchInput.value = item.name;
                    hideResults();
                });
                resultsDiv.appendChild(row);
            }
        });
}
