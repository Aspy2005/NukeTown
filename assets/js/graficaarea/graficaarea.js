
const array = ['../csv/02 modern-renewable-energy-consumption.csv'];

async function filtrar() {
    const response = await fetch(array[0]); // Cargar archivo CSV
    const data = await response.text(); // Leerlo como texto

    // Crear arreglos para clasificar por tipo de energía
    const years = [];
    const biomass = [];
    const solar = [];
    const wind = [];
    const hydro = [];

    const rows = data.split('\n').slice(1); // Divide el CSV en filas (sin encabezado)

    rows.forEach(row => {
        // Divide la fila en columnas
        const [entity, code, year, biomassValue, solarValue, windValue, hydroValue] = row.split(',');

        // Filtrar datos solo para Colombia entre 2000 y 2021
        if (entity === "Colombia" && parseInt(year) >= 2000 && parseInt(year) <= 2021) {
            years.push(parseInt(year)); // Guardar años

            // Guardar los valores por tipo de energía
            biomass.push(parseFloat(biomassValue) || 0); // Convertir a número, usar 0 si es inválido
            solar.push(parseFloat(solarValue) || 0);
            wind.push(parseFloat(windValue) || 0);
            hydro.push(parseFloat(hydroValue) || 0);
        }
    });

    // Regresar los datos clasificados
    return {
        years,
        biomass,
        solar,
        wind,
        hydro
    };
}


async function createAreaChart() {

    try{
        result = await filtrar();
        const ctx = document.getElementById('graficaarea').getContext('2d');
        new Chart(ctx, {
            type: 'line', // Gráfico de área (basado en líneas)
            data: {
                labels: result.years, // Años en el eje X
                datasets: [
                    {
                        label: 'Energía de Biomasa y Geotérmica',
                        data: result.biomass,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Energía Solar',
                        data: result.solar,
                        fill: true,
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Energía Eólica',
                        data: result.wind,
                        fill: true,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Energía Hidroeléctrica',
                        data: result.hydro,
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Año'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Consumo de Energía (TWh)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }catch(error){
        createAreaChart();
    }
    
}




document.addEventListener("DOMContentLoaded", function() {
    // Escucha los clics en el contenedor de botones
    document.getElementById("eolica").addEventListener("click", function(event) {
        mostrartabla(0);
    });
})

async function mostrartabla(select) {
    console.log("Entro en la función mostrar tabla");

    try {
        const respuesta = await fetch(array[select]); // Cargar el archivo CSV
        const texto = await respuesta.text(); // Leer el contenido como texto

        const lineas = texto.split("\n"); // Dividir el contenido por líneas
        const encabezados = lineas[0].split(","); // Obtener los encabezados (primera línea)
        const cuerpo = lineas.slice(1); // Obtener las filas de datos

        const tbody = document.querySelector("#tabladatos tbody");
        console.log(tbody);

        // Limpiar el contenido previo del tbody
        tbody.innerHTML = "";

        // Recorrer cada línea de datos
        cuerpo.forEach((linea) => {
            const columnas = linea.split(","); // Dividir las columnas por coma
            // Verificar que la línea tenga el número correcto de columnas
            if (columnas.length === encabezados.length) { 
                const fila = document.createElement("tr");

                // Crear celdas para cada columna
                columnas.forEach((dato) => {
                    const celda = document.createElement("td");
                    celda.textContent = dato.trim();
                    fila.appendChild(celda);
                });

                tbody.appendChild(fila); // Añadir la fila al cuerpo de la tabla
            }
        });
    } catch (error) {
        console.error("Error al cargar el archivo CSV:", error);
    }
}


createAreaChart();


