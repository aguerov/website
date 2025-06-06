// Carga y muestra los enlaces desde scraper_aduana.json
// Este archivo puede ampliarse para manejar más funcionalidades.

let linksData = [];

// Obtener los datos y renderizar al inicio
// La ruta se ajusta para que funcione cuando la página se sirva desde la raíz
// del sitio, manteniendo los datos en la carpeta "aduana_enlaces".
fetch('aduana_enlaces/scraper_aduana.json')
    .then(resp => resp.json())
    .then(data => {
        linksData = data;
        renderLinks(linksData);
    })
    .catch(err => console.error('Error al cargar datos', err));

/**
 * Agrupa y dibuja los enlaces en el contenedor principal
 * @param {Array} data - Lista de objetos con {title, url, description, category}
 */
function renderLinks(data) {
    const container = document.getElementById('link-groups');
    container.innerHTML = '';

    // Agrupar por categoría
    const groups = {};
    data.forEach(item => {
        const group = item.category || 'Otros';
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
    });

    // Crear estructura HTML
    Object.keys(groups).forEach(group => {
        const section = document.createElement('section');
        section.className = 'group-section';

        const title = document.createElement('h2');
        title.className = 'text-lg font-bold mb-4';
        title.textContent = group;
        section.appendChild(title);

        const ul = document.createElement('ul');
        ul.className = 'space-y-2';

        groups[group].forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.title;
            a.className = 'text-blue-700 hover:underline focus:underline';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', link.description || link.title);
            li.appendChild(a);

            if (link.description) {
                const p = document.createElement('p');
                p.textContent = link.description;
                p.className = 'text-sm text-gray-600';
                li.appendChild(p);
            }

            ul.appendChild(li);
        });

        section.appendChild(ul);
        container.appendChild(section);
    });
}

// Filtrar mientras se escribe
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const filtered = linksData.filter(item =>
        item.title.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
    renderLinks(filtered);
    highlight(term);
});

/**
 * Resalta la palabra buscada dentro del contenedor
 */
function highlight(term) {
    const container = document.getElementById('link-groups');
    if (!term) {
        container.querySelectorAll('mark').forEach(m => m.replaceWith(m.textContent));
        return;
    }
    const regex = new RegExp(`(${term})`, 'gi');
    container.querySelectorAll('li').forEach(li => {
        li.innerHTML = li.innerHTML.replace(/<mark>|<\/mark>/g, '');
        li.innerHTML = li.innerHTML.replace(regex, '<mark>$1</mark>');
    });
}
