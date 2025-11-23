// Seleciona o elemento do DOM que tem o id 'possiveisResults' e o armazena na variável possibleContainer.
const possibleContainer = document.getElementById('possiveisResults'); 

// Declara uma variável 'data' como um array vazio — ela receberá os objetos com nome e href posteriormente.
let data = [];

// possibleContainer.querySelectorAll('a') retorna uma NodeList com todos os elementos <a> dentro
// do elemento possibleContainer. Se possibleContainer for null, essa chamada lançaria um erro.
// Array.from(...) converte essa NodeList (ou qualquer iterable) em um array real para podermos usar
// métodos de array como map() e filter().
const anchors = Array.from(possibleContainer.querySelectorAll('a'));

// Aqui transformamos cada elemento <a> em um objeto com propriedades 'name' e 'href'.
data = anchors.map(a => ({
    // name: tentamos extrair o texto do link de várias formas, em ordem de preferência:
    // 1) a.textContent — todo o texto que aparece dentro da tag <a>.
    // 2) a.getAttribute('title') — o atributo title (útil se o texto visível estiver vazio).
    // 3) a.id — o id do elemento <a>, caso exista.
    // 4) a.getAttribute('href') — o destino do link também pode servir como nome alternativo.
    // 5) '' — se nada dos itens acima existir, usamos string vazia para evitar undefined.
    // Depois usamos .trim() para remover espaços em branco no início/fim do texto.
    name: (a.textContent || a.getAttribute('title') || a.id || a.getAttribute('href') || '').trim(),

    // href: pegamos o atributo href do link. Isso pode ser null se o atributo não existir.
    href: a.getAttribute('href')
}))

// .filter(item => item.name) mantém apenas os objetos cujo campo 'name' seja truthy.
// Ou seja, remove objetos com name = '' (string vazia), null, undefined, 0, false.
// O objetivo é descartar links que não forneçam um "nome" válido.
.filter(item => item.name);

// ---------------------------------------------------------
// Seleciona o formulário de busca no HTML.
// Este formulário provavelmente contém o campo de texto e o botão de enviar.
// É importante capturar o formulário para poder interceptar o envio e impedir
// que a página recarregue (padrão dos formulários).
// ---------------------------------------------------------
const searchForm = document.getElementById('searchForm');


// ---------------------------------------------------------
// Seleciona o campo onde o usuário digita o que deseja buscar.
// Vamos usar esse valor quando o formulário for enviado.
// ---------------------------------------------------------
const searchInput = document.getElementById('searchInput');




// ---------------------------------------------------------
// Este é o container onde exibiremos os resultados da busca
// (normalmente uma lista de links ou itens encontrados).
// ---------------------------------------------------------
const resultsDiv = document.getElementById('results');

// =====================================================================
//                 EVENTO DE ENVIO DO FORMULÁRIO DE BUSCA
// =====================================================================
searchForm.addEventListener('submit', function(event) {

    // Impede o comportamento padrão do formulário.
    // Normalmente, o formulário recarregaria a página ao enviar,
    // o que destruiria os resultados e o estado atual.
    event.preventDefault();

    // Captura o texto digitado e converte para minúsculas.
    // A conversão para minúsculas garante que a busca não seja sensível
    // a maiúsculas/minúsculas.
    const searchTerm = searchInput.value.toLowerCase();

    // Chama a função que realmente filtra os dados com base no termo.
    filterData(searchTerm);
});



// =====================================================================
//                 FUNÇÃO DE FILTRAGEM DOS DADOS
// =====================================================================
// Recebe o termo digitado no input e filtra o array "data",
// que deve conter objetos { name, href }.
// A filtragem procura qualquer item cujo "name" contenha o termo.
function filterData(term) {

    // .filter() percorre cada item do array e mantém apenas os que retornarem true.
    const filteredData = data.filter(item => {

        // item.name.toLowerCase(): transforma o nome em minúsculas
        // .includes(term): verifica se o nome contém o termo digitado
        return item.name.toLowerCase().includes(term);
    });

    // Envia os resultados encontrados para a função de exibição.
    displayResults(filteredData);
}



// =====================================================================
//                 FUNÇÃO DE EXIBIR RESULTADOS
// =====================================================================
// Aqui transformamos os objetos filtrados em elementos HTML visíveis.
function displayResults(results) {

    // Primeiro limpamos qualquer resultado anterior para não acumular.
    resultsDiv.innerHTML = '';

    // Se nenhum resultado foi encontrado:
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return; // Encerramos a função aqui.
    }

    // Agora criamos a lista de itens resultado.
    results.forEach(item => {

        // Se o item possuir um link (href):
        if (item.href) {

            // Criamos uma âncora <a>
            const a = document.createElement('a');

            // Definimos o link para onde o clique deve levar
            a.href = item.href;

            // Tailwind classes para estilização visual
            a.className = 'block px-3 py-2 hover:bg-gray-100 rounded text-blue-600';

            // Define o texto do link
            a.textContent = item.name;

            // Ao clicar no link, escondemos os resultados (UX)
            a.addEventListener('click', () => hideResults());

            // Adicionamos o item na lista
            resultsDiv.appendChild(a);


        } else {
            // Caso o item NÃO tenha link, criamos um “item clicável”
            const row = document.createElement('div');

            row.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer rounded';

            row.textContent = item.name;

            // Quando o usuário clicar:
            // 1) Jogamos o nome para dentro do input
            // 2) Escondemos a lista de resultados
            row.addEventListener('click', () => {
                searchInput.value = item.name;
                hideResults();
            });

            // Adicionamos à lista visual
            resultsDiv.appendChild(row);
        }
    });
}

// =====================================================================
//                 INICIALIZAÇÃO DO SWIPER (CARROSSEL)
// =====================================================================

// O evento DOMContentLoaded garante que o código só execute depois que
// TODO o HTML tiver sido carregado (antes das imagens, mas após o DOM existir).
// Sem isso, se tentássemos acessar um elemento antes dele existir no DOM,
// o Swiper poderia falhar ou retornar erro de elemento inexistente.
document.addEventListener('DOMContentLoaded', function() {

    // Como o Swiper é uma biblioteca externa, precisamos confirmar
    // se ela foi realmente carregada.
    // Se o script não tiver sido incluído na página, a variável "Swiper"
    // simplesmente não existirá, e isso impediria erro no console.
    if (typeof Swiper !== 'undefined') {

        // Criamos uma nova instância do Swiper.
        // O seletor '.biographies-swiper' deve apontar para o elemento
        // que contém os slides das biografias.
        const biographiesSwiper = new Swiper('.biographies-swiper', {

            // Ativa looping infinito entre os slides
            loop: true,

            // Define o espaçamento horizontal entre os slides (30px)
            spaceBetween: 30,

            // Quantos slides são visíveis ao mesmo tempo no carrossel.
            // Isso será substituído nos breakpoints para telas maiores.
            slidesPerView: 1,

            // Define quantos slides se movem ao clicar nas setas.
            // Aqui está configurado para avançar apenas 1 por vez.
            slidesPerGroup: 1,

            // ---------------------------------------------------------
            // Breakpoints: adapta o layout conforme o tamanho da tela.
            // Isso torna o carrossel RESPONSIVO.
            // ---------------------------------------------------------
            breakpoints: {
                // Em telas >= 640px: ainda mostra apenas 1 slide
                640: {
                    slidesPerView: 1,
                },
                // Em telas >= 768px: mostra 2 slides simultâneos
                768: {
                    slidesPerView: 1,
                },
                // Em telas >= 1024px: mostra 3 slides simultâneos (desktop)
                1024: {
                    slidesPerView: 3,
                },
            },

            // ---------------------------------------------------------
            // Configuração dos botões de navegação
            // Eles devem existir no HTML com estas classes:
            // .bio-prev  ← botão “voltar”
            // .bio-next  ← botão “avançar”
            // ---------------------------------------------------------
            navigation: {
                nextEl: '.bio-next',
                prevEl: '.bio-prev',
            },
        });

    } else {
        // Se o Swiper não foi carregado, mostramos um aviso no console
        console.warn('Swiper não foi carregado. Certifique-se de incluir o script do Swiper.');
    }
});

//carrossel banner principal
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {

        const biographiesSwiper = new Swiper('.main-banner-swiper', {

            // Ativa looping infinito entre os slides
            loop: true,
            // ---------------------------------------------------------
            // Configuração dos botões de navegação
            // Eles devem existir no HTML com estas classes:
            // .bio-prev  ← botão “voltar”
            // .bio-next  ← botão “avançar” ., .
            // ---------------------------------------------------------
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    } else {
        console.warn('Swiper não foi carregado. Certifique-se de incluir o script do Swiper.');
    }
});

let menu= document.getElementById('menu-mobile')
let btnMenu = document.getElementById('btn-menu')
let overlayMenu = document.querySelector('.overlay-menu')
let btnFechar = document.getElementById('btn-fechar')
btnMenu.addEventListener('click', () => {
    menu.classList.remove('hidden')
})

btnMenu.addEventListener('click', () => {
    overlayMenu.classList.remove('hidden')
})

menu.addEventListener('click', () => {
    window.location.reload()
})
