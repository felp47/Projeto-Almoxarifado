const selectInsumo = document.getElementById('insumoSelect');
const unidadeDisplay = document.getElementById('unidadeDisplay');
const formMovimentacao = document.getElementById('formMovimentacao');
const corpoHistorico = document.getElementById('corpoHistorico');
const selectSetor = document.getElementById('setor_solicitante');
const idUsuarioLogado = localStorage.getItem('idUsuarioLogado') || 1;
const nomeUsuarioLogado = localStorage.getItem('nomeUsuarioLogado') || "Usuário Desconhecido";

document.getElementById('user').innerText = nomeUsuarioLogado;

let insumosGlobais = []; 

const carregarSetores = async () =>{
    try {
        const resposta = await fetch('/api/setores');
        const setores = await resposta.json();

        selectSetor.innerHTML = '<option value="">Selecione o Setor...</option>';
        setores.forEach(setor =>{
            const option = document.createElement('option');
            option.value = setor.id_setor;
            option.text = setor.setor;
            selectSetor.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar setores",error);
    }
};
const carregarInsumos = async () => {
    try {
        const resposta = await fetch('/api/insumos');
        let insumos = await resposta.json();

       
        for (let i = 0; i < insumos.length - 1; i++) {
            for (let j = 0; j < insumos.length - i - 1; j++) {
                
                if (insumos[j].nome_insumo.localeCompare(insumos[j + 1].nome_insumo) > 0) {
                    let temp = insumos[j];
                    insumos[j] = insumos[j + 1];
                    insumos[j + 1] = temp;
                }
            }
        }
        
        insumosGlobais = insumos; 
        selectInsumo.innerHTML = '<option value="">Selecione um insumo...</option>';

        insumos.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.id_insumo;
            option.text = `${insumo.nome_insumo} (Estoque: ${insumo.quantidade_estoque})`;
            selectInsumo.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar insumos:", error);
    }
};


selectInsumo.addEventListener('change', (e) => {
    const idSelecionado = e.target.value;
    const insumo = insumosGlobais.find(i => i.id_insumo == idSelecionado);
    if(insumo) {
        unidadeDisplay.innerText = insumo.unidade_medida;
    } else {
        unidadeDisplay.innerText = "Unidade";
    }
});

formMovimentacao.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const id_insumo = selectInsumo.value;
    const tipo_movimentacao = document.getElementById('tipo_movimentacao').value;
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const id_setor = parseInt(document.getElementById('setor_solicitante').value);
    
    
    const insumo = insumosGlobais.find(i => i.id_insumo == id_insumo);

    
    if (tipo_movimentacao === 'RETIRADA' && quantidade > insumo.quantidade_estoque) {
        alert(`Erro Impeditivo: Saldo insuficiente. Você solicitou ${quantidade}, mas só há ${insumo.quantidade_estoque} disponível.`);
        return; 
    }

   
    let novoEstoque = insumo.quantidade_estoque;
    if (tipo_movimentacao === 'RETIRADA') novoEstoque -= quantidade;
    if (tipo_movimentacao === 'REPOSIÇÃO') novoEstoque += quantidade;

    if (novoEstoque <= insumo.estoque_minimo) {
        alert(`⚠️ ALERTA: Esta movimentação deixará o item "${insumo.nome_insumo}" em nível crítico (Saldo ficará em ${novoEstoque}).`);
       
    }
    try {
        const resposta = await fetch('/api/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_insumo,
                tipo_movimentacao,
                quantidade,
                id_setor,
                id_usuario:idUsuarioLogado })
        });

        if (resposta.ok) {
            alert("Movimentação registrada com sucesso!");
            formMovimentacao.reset(); 
            carregarInsumos(); 
            carregarHistorico(); 
        } else {
            alert("Erro ao salvar a movimentação no servidor.");
        }
    } catch (error) {
        console.error("Erro no envio:", error);
    }
});

const carregarHistorico = async () => {
    try {
        const resposta = await fetch('/api/movimentacoes');
        const historico = await resposta.json();
        
        corpoHistorico.innerHTML = '';
        historico.forEach(mov => {
            const linha = document.createElement('tr');
            const dataFormatada = new Date(mov.data_movimentacao).toLocaleString('pt-BR');
            linha.innerHTML = `
                <td>${mov.id_movimentacao}</td>
                <td>${dataFormatada}</td>
                <td>${mov.nome_insumo}</td>
                <td><strong style="color: ${mov.tipo_movimentacao === 'REPOSIÇÃO' ? 'green' : 'red'};">${mov.tipo_movimentacao}</strong></td>
                <td>${mov.quantidade}</td>
                <td>${mov.setor || 'N/A'}</td>
                <td>${mov.nome_usuario || 'Sistema'}</td>
            `;
            corpoHistorico.appendChild(linha);
        });
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    carregarInsumos();
    carregarSetores();
    carregarHistorico();
});