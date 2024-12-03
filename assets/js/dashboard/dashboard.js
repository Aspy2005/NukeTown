async function fetchCSV(select) {

    console.log(select);
    const response = await fetch('pruebacsv'); 
    const data = await response.text(); 

    const rows = data.split('\n').slice(1); 
    console.log (rows);
    const labels = []; 
    const values = [];


    
    if (select == 0 ){
        rows.forEach(row => {
            const [label, value] = row.split(','); 
            labels.push(label); 
            values.push(parseFloat(value)); 
        });
    }else{
        rows.forEach(row => {
            const [label, value] = row.split(','); 
            if(select == label){
                labels.push(label); 
                values.push(parseFloat(value)); 
            }
                    
        });
    }
       

    return { labels, values };
      
}

async function createChartbar(data) {


    const ctx = document.getElementById('graficabarras').getContext('2d');
    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: data.labels, 
            datasets: [{
                label: 'notas',
                data: data.values, 
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
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

async function createPieChart(data) {

    const ctx = document.getElementById('graficacircular').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
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

async function createLineChart(data) {

    const ctx = document.getElementById('graficalinea').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Dataset de Líneas',
                data: data.values,
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

async function createAreaChart(data) {

    const ctx = document.getElementById('graficaarea').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Dataset de Área',
                data: data.values,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.3)',
                borderWidth: 2,
                fill: true 
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


async function createlista(){
    
    const data = await fetchCSV(document.getElementById("seleccion").value);

    const listado = document.getElementById("seleccion");

    for (i=0; i< data.labels.length ; i++){
            if(data.labels[i] !== data.labels[i+1]){
                const celda = document.createElement("option");
                celda.textContent = data.labels[i].label;
                celda.value = data.labels[i].value;
                listado.appendChild(celda);
            }
        
    }
    console.log(listado.options);
}

function actualizarGrafica(elementId, type, data, label) {
    const canvas = document.getElementById(elementId);
    const ctx = canvas.getContext('2d');

    if (canvas.chartInstance) {
        canvas.chartInstance.data.labels = data.labels;
        canvas.chartInstance.data.datasets[0].data = data.values;
        canvas.chartInstance.update();
    } else {
        
        canvas.chartInstance = new Chart(ctx, {
            type: type,
            data: {
                labels: data.labels,
                datasets: [{
                    label: label,
                    data: data.values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
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
}


document.addEventListener("DOMContentLoaded",async ()=>{

    console.log(document.getElementById("seleccion").value);     

    createlista();

    document.getElementById("seleccion").addEventListener('change', async ()=>{

        const select = document.getElementById("seleccion").value;

        const data = await fetchCSV(select);

        actualizarGrafica('graficabarras', 'bar', data, 'Notas');
        actualizarGrafica('graficacircular', 'pie', data, 'Notas');
        actualizarGrafica('graficalinea', 'line', data, 'Notas');
        actualizarGrafica('graficaarea', 'line', data, 'Área');

    }); 
})