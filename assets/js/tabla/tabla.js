async function fetchCSV(select1, select2) {
    const response = await fetch('../csv/01 renewable-share-energy.csv'); // Cargar archivo CSV
    const data = await response.text(); // Leerlo como texto

    const rows = data.split('\n').slice(1); // Dividir en filas y eliminar encabezado
    console.log(rows);

    const entity = [];
    const code = [];
    const year = [];
    const renewable = [];

    // Filtrar y procesar filas del CSV
    rows.forEach(row => {
        const [currentEntity, currentCode, currentYear, currentRenewable] = row.split(',');

        // Filtrar según select1 (entidad) y select2 (año)
        if (
            (select1 === "0" || currentEntity === select1) && // Filtro por entidad
            (select2 === "0" || parseInt(currentYear) === parseInt(select2)) // Filtro por año
        ) {
            entity.push(currentEntity); // Agregar entidad
            code.push(currentCode); // Agregar código
            year.push(parseInt(currentYear)); // Agregar año
            renewable.push(parseFloat(currentRenewable)); // Agregar valor de energía renovable
        }
    });

    console.log({ entity, code, year, renewable });
    return { entity, code, year, renewable };
}

async function createlista(){
    
    const data = await fetchCSV(document.getElementById("seleccion1").value, document.getElementById("seleccion2").value);

    const listado = document.getElementById("seleccion1");
    const listado2 = document.getElementById("seleccion2");

    for (i=0; i< data.entity.length ; i++){
            if(data.entity[i] !== data.entity[i+1]){
                const celda = document.createElement("option");
                celda.textContent = data.entity[i];
                celda.value = data.entity[i];
                listado.appendChild(celda);
            }
        
    }

    for (let year = 1965; year <= 2022; year++) {
        const option = document.createElement('option'); // Crear elemento <option>
        option.value = year; // Establecer el valor del <option>
        option.textContent = year; // Establecer el texto visible
        listado2.appendChild(option); // Agregar la opción al <select>
    }
}

async function mostrartabla(data) {
    console.log("Mostrando los datos en la tabla...");

    try {
        const tbody = document.querySelector("#tabladatos tbody");
        if (!tbody) {
            console.error("No se encontró el tbody en la tabla");
            return;
        }

        // Limpiar el contenido previo del tbody
        tbody.innerHTML = "";

        // Verificar que los datos contienen información
        if (!data || data.entity.length === 0) {
            console.log("No hay datos para mostrar");
            return;
        }

        // Recorrer cada fila de datos y crear las filas de la tabla
        for (let i = 0; i < data.entity.length; i++) {
            const fila = document.createElement("tr");

            // Crear celdas para cada dato
            const celdaEntidad = document.createElement("td");
            celdaEntidad.textContent = data.entity[i];
            fila.appendChild(celdaEntidad);

            const celdaCodigo = document.createElement("td");
            celdaCodigo.textContent = data.code[i];
            fila.appendChild(celdaCodigo);

            const celdaAnio = document.createElement("td");
            celdaAnio.textContent = data.year[i];
            fila.appendChild(celdaAnio);

            const celdaRenovable = document.createElement("td");
            celdaRenovable.textContent = data.renewable[i];
            fila.appendChild(celdaRenovable);

            tbody.appendChild(fila); // Añadir la fila al cuerpo de la tabla
        }

        console.log("Datos mostrados correctamente en la tabla.");
    } catch (error) {
        console.error("Error al mostrar la tabla:", error);
    }
}


document.addEventListener("DOMContentLoaded",async ()=>{
    

    createlista();

    document.getElementById("buscar").addEventListener('click', async ()=>{

        const select1 = document.getElementById("seleccion1").value;
        const select2 = document.getElementById("seleccion2").value;

        const data = await fetchCSV(select1, select2);

       mostrartabla(data);

    }); 
})




