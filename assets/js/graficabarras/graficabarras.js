const array = ['../csv/08 wind-generation.csv', 
    '../csv/12 solar-energy-consumption.csv',
    '../csv/05 hydropower-consumption.csv',
    '../csv/16 biofuel-production.csv',
    '../csv/17 installed-geothermal-capacity.csv'
];

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


async function filtrar(){


    const entity = [];
    const code = [];
    const year = [];
    const value = [];



    for(i=0; i<array.length; i++){
        const response = await fetch(array[i]); // Cargar archivo CSV
        const data = await response.text(); // Leerlo como texto

        const rows = data.split('\n').slice(1);//divide el csv en filas

        rows.forEach(row=>{
            const [enti, cod, yea, valu] = row.split(',');//separa la fila en los datos
            if(enti === "Colombia" && yea === "2021"){
                entity.push(enti);
                code.push(cod);
                year.push(yea);
                value.push(valu);
            };
        });

    };


    return { year, value};
                
}

async function crearGraficaBarras() {
    // Obtener los datos filtrados
    const datos = await filtrar();

    // Configurar la gráfica
    const ctx = document.getElementById('graficabarras').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["eolica", "solar", "hidrica","biofucel", "geotermica"], // Eje X: Códigos de las fuentes de energía
            datasets: [{
                label: 'Producción de Energía en Colombia (2021)',
                data: datos.value, // Eje Y: Valores (producción)
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // Comenzar el eje Y desde 0
                }
            }
        }
    });
}

// Función unificada para manejar las acciones
function manejarAccion(buttonId) {
    switch (buttonId) {
        case "eolica":
            console.log("Has seleccionado Energía Eólica");
            mostrartabla(0);
            break;
            // Aquí tu lógica para Energía Eólica
        case "hidrica":
            console.log("Has seleccionado Energía Hídrica");
            mostrartabla(2);
            // Aquí tu lógica para Energía Hídrica
            break;
        case "solar":
            console.log("Has seleccionado Energía Solar");
            // Aquí tu lógica para Energía Solar
            mostrartabla(1);
            break;
        case "biofucel":
            console.log("Has seleccionado Biofucel");
            // Aquí tu lógica para Biofucel
            mostrartabla(3);
            break;
        
        case "geotermico":
            mostrartabla(4);
        default:
            console.log("Acción no reconocida");
    }
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




crearGraficaBarras();