function aproximarConcentracao(alpha, deltaT, deltaX, L, Ce, Ci, tempo) {
    let nx = Math.floor(L / deltaX);
    let nt = Math.floor(tempo / deltaT);
    
    // Matriz para armazenar a solução ao longo do tempo
    let C = [];
    let C_new = [];
    
    // Inicialização da matriz
    for (let i = 0; i <= nx; i++) {
      C[i] = [];
      C_new[i] = [];
      for (let j = 0; j <= nt; j++) {
        C[i][j] = 0;
        C_new[i][j] = 0;
      }
    }
    
    // Condição inicial
    for (let i = 0; i <= nx; i++) {
      C[i][0] = Ci;
    }
    
    // Condição de contorno na borda esquerda
    for (let j = 1; j <= nt; j++) {
      C[0][j] = Ce;
      C_new[0][j] = Ce;
    }
    
    // Loop no tempo
    for (let j = 1; j <= nt; j++) {
      // Loop no espaço
      for (let i = 1; i < nx; i++) {
        C_new[i][j] = (C[i - 1][j - 1] + C[i + 1][j - 1] + alpha * deltaT * (C[i + 1][j - 1] - 2 * C[i][j - 1] + C[i - 1][j - 1]) / deltaX^2) / 2;
      }
      for (let i = 1; i < nx; i++) {
        C[i][j] = C_new[i][j];
      }
    }
    
    return C;
  }

  // Função para analisar a estabilidade do método 
function analiseEstabilidadeDeltaX(alpha, deltaX, L, Ce, Ci, tempo) {
    let results = [];
    let deltaTArray = [0.0001];
    
    for (let deltaT of deltaTArray) {
      let C = aproximarConcentracao(alpha, deltaT, deltaX, L, Ce, Ci, tempo);
      results.push(C);
    }

    desenharGrafico(results, deltaTArray, deltaX, L)
    return results;
  }
  
  // Função para desenhar um gráfico dos resultados
function desenharGrafico(results, deltaTArray, deltaX, L) {
    let labels = [];
    for (let i = 0; i <= Math.floor(L / deltaX); i++) {
      labels.push(i * deltaX);
    }
    
    let data = [];
    for (let i = 0; i < results.length; i++) {
      data.push({
        label: 'Δt = ' + deltaTArray[i],
        data: results[i],
        fill: false,
        borderColor: getRandomColor()
      });
    }
    
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: data
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Posição (x)'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Concentração (C)'
            }
          }]
        }
      }
    });
  }
  
  // Função para gerar uma cor aleatória
  function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // dados
  let alpha = 5 * Math.pow(10, -3)
  let L = 10
  let tempo = 10
  let Ce = 5
  let Ci = 22
  let deltaX = 0.001

  analiseEstabilidadeDeltaX(alpha, deltaX, L, Ce, Ci, tempo)
  
  