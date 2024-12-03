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

function manejarAccion(buttonId) {
    switch (buttonId) {
        case "eolica":
            console.log("Has seleccionado Energía Eólica");
            mostrartabla(1);
            break;
            // Aquí tu lógica para Energía Eólica
        case "solar":
            console.log("Has seleccionado Energía Hídrica");
            mostrartabla(2);
            // Aquí tu lógica para Energía Hídrica
            break;
        case "hidrica":
            console.log("Has seleccionado Energía Solar");
            // Aquí tu lógica para Energía Solar
            mostrartabla(3);
            break;

        default:
            console.log("Acción no reconocida");
    }
}

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
            if(enti === "Canada" && parseInt(yea) >= 2000 && parseInt(yea) <= 2021 ){
                entity.push(enti);
                code.push(cod);
                year.push(yea);
                value.push(valu);
            };
        });

    };

    console.log(year, value)

    return { year, value};
                
}

async function createLineChart() {

    const data = await filtrar();

    const ctx = document.getElementById('graficalinea').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.year,
            datasets: [{
                label: 'Dataset de Líneas',
                data: data.value,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
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

createLineChart();