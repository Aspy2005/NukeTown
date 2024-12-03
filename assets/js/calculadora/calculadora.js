document.addEventListener("DOMContentLoaded", () => {
  const calcularMensualButton = document.getElementById("calcularMensual");
  const calcularPorcentajeButton = document.getElementById("calcularPorcentaje");
  const consumoInput = document.getElementById("consumo");
  const resultadoElement = document.getElementById("resultado");

 
 
  calcularPorcentajeButton.addEventListener("click", () => {
      const consumoMensual = parseFloat(consumoInput.value);
      if (!consumoInput.value.trim() || consumoMensual <= 0) {
          resultadoElement.textContent = "Por favor, ingrese un porcentajes consumo válido.";
          return;
      }

      
      const consumoAnualTWh = (consumoMensual / 1000) * 12;

   
      const consumoColombiaTWh = 0.32;

      
      const porcentajeConsumo = ((consumoAnualTWh / consumoColombiaTWh) * 100).toFixed(2);

      resultadoElement.textContent = `
          Su consumo anual representa el ${porcentajeConsumo}% del consumo total de Colombia respecto al 2021 (0.31732163).
      `;
  });                                                               
});