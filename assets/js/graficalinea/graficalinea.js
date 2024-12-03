const array= [
    '../csv/09 cumulative-installed-wind-energy-capacity-gigawatts.csv',
    '../csv/13 installed-solar-PV-capacity.csv',
    '../csv/17 installed-geothermal-capacity.csv'
]

document.addEventListener("DOMContentLoaded", function() {
    // Escucha los clics en el contenedor de botones
    document.getElementById("menucsv").addEventListener("click", function(event) {
        const button = event.target; // Elemento que fue clickeado
        const buttonId = button.id; // Obtén el id del botón clickeado

        if (buttonId) { // Verifica que el elemento clickeado tenga un id
            manejarAccion(buttonId);
        }
    });
})

async function filtrar(index) {
    const year = [];
    const value = [];

    const response = await fetch(array[index]); // Cargar archivo CSV
    const data = await response.text(); // Leerlo como texto

    const rows = data.split('\n').slice(1); // Divide el CSV en filas (sin encabezado)

    rows.forEach(row => {
        const [enti, cod, yea, valu] = row.split(','); // Divide la fila en columnas
        if (enti === "China" && parseInt(yea) >= 2000 && parseInt(yea) <= 2021) {
            year.push(parseInt(yea)); // Asegura que los años sean números
            value.push(parseFloat(valu)); // Asegura que los valores sean números
        }
    });
    console.log(index, year, value);
    return { year, value };
}

async function createLineChart() {
    const datasets = [];
    const energyLabels = ['Eólica', 'Solar', 'Geotérmica'];
    const colors = [
        'rgba(75, 192, 192, 1)', // Eólica
        'rgba(255, 99, 132, 1)', // Solar
        'rgba(54, 162, 235, 1)'  // Geotérmica
    ];
    const backgroundColors = [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    let labels = [];

    // Procesa los datos de cada archivo
    for (let i = 0; i < array.length; i++) {
        const data = await filtrar(i);

        // Usa los años del primer archivo como etiquetas comunes
        if (i === 0) labels = data.year;

        datasets.push({
            label: `Energía ${energyLabels[i]}`,
            data: data.value,
            borderColor: colors[i],
            backgroundColor: backgroundColors[i],
            borderWidth: 2
        });
    }

    const ctx = document.getElementById('graficalinea').getContext('2d');


    // Crea la nueva gráfica
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Años como etiquetas en el eje X
            datasets: datasets // Tres líneas para las energías
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

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

function manejarAccion(buttonId) {
    switch (buttonId) {
        case "eolica":
            console.log("Has seleccionado Energía Eólica");
            mostrartabla(0);
            break;
            // Aquí tu lógica para Energía Eólica
        case "solar":
            console.log("Has seleccionado Energía Hídrica");
            mostrartabla(1);
            // Aquí tu lógica para Energía Hídrica
            break;
        case "hidrica":
            console.log("Has seleccionado Energía Solar");
            // Aquí tu lógica para Energía Solar
            mostrartabla(2);
            break;

        default:
            console.log("Acción no reconocida");
    }
}
// Crear la gráfica
createLineChart();
