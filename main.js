document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.nav-link');
    const loaderHTML = '<div class="loader"></div>';

    /**
     * Carga el contenido de la página solicitada mediante Fetch API.
     * @param {string} page - El nombre del archivo HTML a cargar (sin la extensión).
     */
    const loadContent = async (page) => {
        // Muestra el loader
        contentArea.innerHTML = loaderHTML;
        
        // Actualiza el enlace activo en la navegación
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        try {
            // Pide el contenido del archivo HTML
            const response = await fetch(`${page}.html`);
            if (!response.ok) throw new Error(`Page not found: ${page}.html`);
            const html = await response.text();
            
            // Inserta el HTML y luego inicializa las gráficas
            contentArea.innerHTML = html;
            initializeCharts(page);

        } catch (error) {
            contentArea.innerHTML = `<p style="text-align:center; color:red;">Error al cargar el contenido. Por favor, asegúrate de estar usando un servidor local.</p>`;
            console.error('Fetch error:', error);
        }
    };

    /**
     * Llama a la función de creación de gráficas correspondiente a la página cargada.
     * @param {string} page - La página actualmente visible.
     */
    const initializeCharts = (page) => {
        if (page === 'politica') {
            createSalaryChart();
            createCorruptionChart();
        } else if (page === 'alvise') {
            createElectionChart();
        }
    };

    // --- FUNCIONES DE CREACIÓN DE GRÁFICAS ---

    const createSalaryChart = () => {
        const ctx = document.getElementById('salary-chart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['SMI Anual (2024)', 'Salario Medio Anual', 'Ingreso Alto Cargo Político (aprox.)'],
                datasets: [{
                    label: 'Ingresos Brutos Anuales en €',
                    data: [15876, 28360, 95000], // Datos ilustrativos y redondeados para impacto visual
                    backgroundColor: ['#ffc107', '#17a2b8', '#dc3545'],
                    borderColor: ['#ffc107', '#17a2b8', '#dc3545'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Comparativa de Ingresos Anuales (Ilustrativo)', font: { size: 16 } },
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: value => value.toLocaleString('es-ES') + ' €' } }
                }
            }
        });
    };

    const createCorruptionChart = () => {
        const ctx = document.getElementById('corruption-chart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Considera la corrupción un problema principal', 'Otras respuestas'],
                datasets: [{
                    data: [38, 62], // Dato ilustrativo basado en barómetros históricos del CIS
                    backgroundColor: ['#dc3545', '#e9ecef'],
                    hoverOffset: 4,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Percepción de la Corrupción (CIS, ilustrativo)', font: { size: 16 } },
                    legend: { position: 'top' }
                }
            }
        });
    };

    const createElectionChart = () => {
        const ctx = document.getElementById('election-chart')?.getContext('2d');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PP', 'PSOE', 'Vox', 'Ahora Repúblicas', 'Sumar', 'Se Acabó La Fiesta', 'Junts', 'CEUS'],
                datasets: [{
                    label: 'Escaños Elecciones Europeas 2024',
                    data: [22, 20, 6, 3, 3, 3, 1, 1], // Datos reales
                    backgroundColor: ['#0d6efd', '#dc3545', '#28a745', '#ffc107', '#6f42c1', '#343a40', '#fd7e14', '#17a2b8'],
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Resultados Elecciones Europeas España 2024 (Escaños)', font: { size: 16 } },
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { stepSize: 2 } }
                }
            }
        });
    };

    // --- MANEJO DE LA NAVEGACIÓN ---

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) {
                loadContent(page);
            }
        });
    });

    // --- CARGA INICIAL ---
    // Carga la primera sección por defecto al entrar en la página.
    loadContent('politica');
});

