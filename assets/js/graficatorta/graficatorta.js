const array= ['../csv/04 share-electricity-renewables.csv',
    '../csv/11 share-electricity-wind.csv',
    '../csv/15 share-electricity-solar.csv',
    '../csv/06 hydro-share-energy.csv'
];


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


async function createPieChart() {

    const data = await filtrar();

    const ctx = document.getElementById('graficacircular').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["eolica", "solar", "hidrica","biofucel", "geotermica"],
            datasets: [{
                data: data.value,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderWidth: 1
            }]
        }
    });
}

createPieChart();