async function fetchCSV() {

    const response = await fetch('../csv/indefinidos.csv'); 
    const data = await response.text(); 

    const rows = data.split('\n').slice(1); 
    console.log (rows);
    const labels = []; 
    const values = [];


    rows.forEach(row => {
        const [label, value] = row.split(','); 
        labels.push(label); 
        values.push(parseFloat(value)); 
    });
    
       
    console.log(labels);
    return { labels, values };
    
      
}

async function createChartbar() {

    const data = await fetchCSV();


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

async function createPieChart() {

    const data = await fetchCSV();

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

async function createLineChart() {

    const data = await fetchCSV();

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

async function createAreaChart() {

    const data = await fetchCSV();

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


createChartbar();
createPieChart()
createLineChart()
createAreaChart()