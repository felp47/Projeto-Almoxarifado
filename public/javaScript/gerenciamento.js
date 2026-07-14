const celulas_Tabelas = document.getElementById('corpoTabela');
const campoBusca = document.getElementById('campoBusca'); 



document.addEventListener('DOMContentLoaded', () => {
    // Busca os dados do usuário que foram guardados no login
    const idUsuarioLogado = localStorage.getItem('idUsuarioLogado') || 1;
    const nomeUsuarioLogado = localStorage.getItem('nomeUsuarioLogado') || "Usuário Desconhecido";

    // Encontra o  id="user" da página atual
    const elementoUser = document.getElementById('user');
    
    
    if (elementoUser) {
        elementoUser.innerText = nomeUsuarioLogado;
    }
});
// Busca os insumos da API e renderiza a tabela dinamicamente
const carregarTabela = async (termoPesquisa = '') => {
    try {
        let url = '/api/insumos';

        if (termoPesquisa.trim() !== '') {
            url = `/api/insumos/busca?termo=${encodeURIComponent(termoPesquisa)}`;
        }

        const resposta = await fetch(url);
        const insumos = await resposta.json();

        celulas_Tabelas.innerHTML = ''; 

        insumos.forEach(elemento => {
            const linha = document.createElement('tr');

            // Formatação para a data de validade 
            const validadeFormatada = elemento.data_validade 
                ? elemento.data_validade.split('-').reverse().join('/') 
                : 'N/A';

            linha.innerHTML = `
                <td>${elemento.id_insumo}</td>
                <td><strong>${elemento.nome_insumo}</strong></td>
                <td>${elemento.nome_categoria || 'Outros'}</td>
                <td>${elemento.lote || 'N/A'}</td>
                <td>${validadeFormatada}</td>
                <td>${elemento.unidade_medida}</td>
                <td>${elemento.quantidade_estoque}</td>
                <td>${elemento.estoque_minimo}</td>
                <td>${elemento.nome_fornecedor || 'Não Informado'}</td>
                <td>
                    <button class="btn-editar" data-id="${elemento.id_insumo}">Editar</button>
                    <button class="btn-excluir" data-id="${elemento.id_insumo}">Excluir</button>
                </td>
            `;

            celulas_Tabelas.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao carregar a tabela:", error);
    }
};

// Escutador do input de pesquisa em tempo real
campoBusca.addEventListener('input', (event) => {
    const textoDigitado = event.target.value;
    carregarTabela(textoDigitado); 
});

// Inicialização única ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => carregarTabela());

// Gerenciamento de cliques nas ações (Editar e Excluir) 
celulas_Tabelas.addEventListener('click', async (event) => {
    const elementoClicado = event.target;

    //  Excluir
    if (elementoClicado.classList.contains('btn-excluir')) {
        const idInsumo = elementoClicado.getAttribute('data-id');
        const confirmar = confirm(`Tem certeza que deseja excluir o insumo com ID ${idInsumo}?`);
        
        if (confirmar) {
            await executarExclusao(idInsumo);
        }
    }

    //  Editar
    if (elementoClicado.classList.contains('btn-editar')) {
        const idInsumo = elementoClicado.getAttribute('data-id');
        window.location.href = `cadastro-insumos.html?editar=${idInsumo}`;
    }
}); 

// requisição DELETE 
const executarExclusao = async (id) => {
    try {
        const resposta = await fetch(`/api/insumos/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert("Insumo excluído com sucesso!");
            carregarTabela(campoBusca.value); // Recarrega mantendo o filtro atual se houver
        } else {
            const dadosErro = await resposta.json();
            alert("Erro ao excluir o insumo: " + (dadosErro.error || "Tente novamente."));
        }
    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
        alert("Não foi possível conectar ao servidor.");
    }
};