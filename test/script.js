const canvas = document.getElementById("automatoCanvas");
const ctx = canvas.getContext("2d");
const log = document.getElementById("log");

// Definição do AFD
const afd = {
  estados: {
    q0: { x: 100, y: 150 },
    q1: { x: 300, y: 150 },
    q2: { x: 500, y: 150 }
  },
  alfabeto: ['a', 'b'],
  transicoes: {
    q0: { a: 'q1', b: 'q0' },
    q1: { a: 'q2', b: 'q1' },
    q2: { a: 'q2', b: 'q2' }
  },
  estadoInicial: 'q0',
  estadosFinais: ['q2']
};

function desenharAutomato(estadoAtual = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar transições
  for (const [estadoOrigem, trans] of Object.entries(afd.transicoes)) {
    for (const [simbolo, estadoDestino] of Object.entries(trans)) {
      const from = afd.estados[estadoOrigem];
      const to = afd.estados[estadoDestino];
      desenharSeta(from.x, from.y, to.x, to.y, simbolo);
    }
  }

  // Desenhar estados
  for (const [estado, pos] of Object.entries(afd.estados)) {
    const isFinal = afd.estadosFinais.includes(estado);
    const isInicial = (estado === afd.estadoInicial);
    const isAtual = (estado === estadoAtual);
    desenharEstado(pos.x, pos.y, estado, isFinal, isInicial, isAtual);
  }
}

function desenharEstado(x, y, nome, final = false, inicial = false, atual = false) {
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = atual ? '#ffcc00' : '#fff';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (final) {
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.fillStyle = '#000';
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(nome, x, y);

  if (inicial) {
    ctx.beginPath();
    ctx.moveTo(x - 50, y);
    ctx.lineTo(x - 30, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 5);
    ctx.lineTo(x - 30, y);
    ctx.lineTo(x - 40, y + 5);
    ctx.fill();
  }
}

function desenharSeta(x1, y1, x2, y2, label) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const dist = Math.hypot(dx, dy);

  const offset = 30;
  const fromX = x1 + Math.cos(angle) * offset;
  const fromY = y1 + Math.sin(angle) * offset;
  const toX = x2 - Math.cos(angle) * offset;
  const toY = y2 - Math.sin(angle) * offset;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Cabeça da seta
  const headlen = 10;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6),
              toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6),
              toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(toX, toY);
  ctx.fill();

  // Label
  const labelX = (fromX + toX) / 2;
  const labelY = (fromY + toY) / 2;
  ctx.fillStyle = '#000';
  ctx.fillText(label, labelX, labelY - 10);
}

async function simular() {
  const entrada = document.getElementById("entrada").value;
  let estadoAtual = afd.estadoInicial;
  log.textContent = `Estado inicial: ${estadoAtual}\n`;

  for (const simbolo of entrada) {
    desenharAutomato(estadoAtual);
    await new Promise(r => setTimeout(r, 1000)); // Delay de 1 segundo

    const proximo = afd.transicoes[estadoAtual]?.[simbolo];
    if (!proximo) {
      log.textContent += `Erro: sem transição de ${estadoAtual} com '${simbolo}'\n`;
      desenharAutomato(null);
      return;
    }
    log.innerHTML += `Lê '${simbolo}': ${estadoAtual} → <span style="color: red;">${proximo}</span>\n`;
    estadoAtual = proximo;
  }

  desenharAutomato(estadoAtual);
  log.textContent += afd.estadosFinais.includes(estadoAtual)
    ? `Estado final: ${estadoAtual} (aceita)\n`
    : `Estado final: ${estadoAtual} (rejeita)\n`;
}

// Desenhar inicialmente
desenharAutomato();
