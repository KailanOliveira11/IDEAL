function formatarCpfCnpj(input) {
    // Remove caracteres que não são números
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
        // Formato CPF: 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Primeiro ponto
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Segundo ponto
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Hífen
    } else if (value.length <= 14) {
        // Formato CNPJ: 00.000.000/0000-00
        value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Primeiro ponto
        value = value.replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2'); // Segundo ponto
        value = value.replace(/(\d{3})(\d{4})(\d{2})$/, '$1/$2-$3'); // Barra e hífen
    }

    // Atualiza o valor do campo
    input.value = value;
}

function criarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("portrait", "mm", "a4");

  // Dados do Formulário
  const tipoParcelamento = document.getElementById("parcelamentoTipo").value;
  const nomeCliente = document.getElementById("nomeCliente").value;
  const cpfCnpj = document.getElementById("cpfCnpj").value;
  const valorTotalDivida = document.getElementById("valorTotalDivida").value;
  const numParcelas = document.getElementById("numParcelas").value;
  const valorParcela = document.getElementById("valorParcela").value;
  const numEntrada = document.getElementById("numEntrada").value;
  const valorEntrada = document.getElementById("valorEntrada").value;
  const observacao = document.getElementById('observacao').value;

  // Tentar carregar o logo
  const logo = 'logo_ideal_sc.png';
  try {
    doc.addImage(logo, "PNG", 85, 10, 40, 30, 20); // Posicionar o logo
  } catch (error) {
    console.error("Logo não carregado:", error);
  }

  // Título centralizado
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("IDEAL SERVIÇOS CONTÁBEIS", 105, 30, null, null, "center");
  doc.text("Informações e Condições de Parcelamento", 105, 40, null, null, "center");

  // Linha de separação
  doc.setLineWidth(0.5);
  doc.setDrawColor(150);
  doc.line(20, 45, 190, 45);

  // Definir estilo da tabela
  const startX = 20;
  let startY = 55;
  const rowHeight = 10;
  const colWidthLabel = 80;
  const colWidthValue = 90;

  const data = [
    { label: "Tipo de Parcelamento:", value: tipoParcelamento },
    { label: "Nome do Cliente ou Empresa:", value: nomeCliente },
    { label: "CPF/CNPJ:", value: cpfCnpj },
    { label: "Valor Total da Dívida:", value: `R$ ${parseFloat(valorTotalDivida).toFixed(2)}` },
    { label: "Número de Parcelas:", value: numParcelas },
    { label: "Valor de Cada Parcela:", value: `R$ ${parseFloat(valorParcela).toFixed(2)}` },
    { label: "Quantidade de Entrada:", value: numEntrada },
    { label: "Valor da Entrada:", value: `R$ ${parseFloat(valorEntrada).toFixed(2)}` }
  ];

  // Aplicar estilo da tabela
  doc.setFontSize(12);
  data.forEach((row, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 240 : 255); // Cor de fundo alternada
    doc.setDrawColor(220); // Cor das bordas

    // Célula de label
    doc.rect(startX, startY, colWidthLabel, rowHeight, "FD"); // Preenchimento e borda
    doc.setTextColor(50);
    doc.text(row.label, startX + 3, startY + 7);

    // Célula de valor
    doc.rect(startX + colWidthLabel, startY, colWidthValue, rowHeight, "FD");
    doc.setTextColor(220);
    doc.text(row.value, startX + colWidthLabel + 3, startY + 7);

    // Atualizar posição para a próxima linha
    startY += rowHeight;
  });

  // Campo de Observação com ajuste de altura dinâmica
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12)
  const observacaoLabel = "Observação:";

  // Label de Observação
  doc.setFillColor(240);
  doc.setDrawColor(220);
  doc.rect(startX, startY, colWidthLabel, rowHeight, "FD");
  doc.setTextColor(50);
  doc.text(observacaoLabel, startX + 3, startY + 5);

  // Conteúdo de Observação ajustado para caber na largura disponível
  const maxWidth = colWidthValue - 6; // Espaço disponível para texto
  const observacaoLinhas = doc.splitTextToSize(observacao, maxWidth);
  const observacaoHeight = observacaoLinhas.length * 8; // Altura baseada no número de linhas geradas

  // Ajustar posição da caixa de observação
  doc.rect(startX + colWidthLabel, startY, colWidthValue, observacaoHeight, "FD");
  doc.setTextColor(220);

  // Adiciona cada linha de texto da observação
  observacaoLinhas.forEach((linha, index) => {
    doc.text(linha, startX + colWidthLabel + 3, startY + 7 + (index * 7));
  });

  startY += observacaoHeight;

  // Nota de rodapé
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Este recibo é emitido automaticamente pelo sistema de parcelamento.", 20, startY + 20);
  doc.text("O valor da entrada, após o pagamento da primeira é paga juntamente as demais parcelas do acordo.", 20, startY + 25);
  doc.text("Caso não pague a primeira parcela de entrada, o acordo é cancelado após o vencimento da DARF.", 20, startY + 30);
  doc.text("Necessário ser refeito! Para mais informações, entre em contato com nosso atendimento.", 20, startY + 35);

  return doc;
}

  function gerarPDF() {
    const doc = criarPDF();
    const nomeCliente = document.getElementById("nomeCliente").value;
    doc.save(`Recibo_Parcelamento_${nomeCliente}.pdf`);
  }
  
  function visualizarPDF() {
    const doc = criarPDF();
  
    // Criar um Blob e abrir o PDF em uma nova aba
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // Abre em nova aba
  }
  
