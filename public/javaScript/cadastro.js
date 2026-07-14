const form = document.getElementById('formInsumo');
const btnSubmeter = form.querySelector('button[type="submit"]');


document.addEventListener('DOMContentLoaded', () => {
    //Busca os dados do usuário que foram guardados no login
    const idUsuarioLogado = localStorage.getItem('idUsuarioLogado') || 1;
    const nomeUsuarioLogado = localStorage.getItem('nomeUsuarioLogado') || "Usuário Desconhecido";

    //Encontra o id="user" da página atual
    const elementoUser = document.getElementById('user');
    
    //  Altera o texto "Usuário" para o nome real (ex: "Paulo")
    if (elementoUser) {
        elementoUser.innerText = nomeUsuarioLogado;
    }
});

//  Verifica se existe o parâmetro "?editar=ID" na barra de endereços da URL
const urlParams = new URLSearchParams(window.location.search);
const idInsumoEdicao = urlParams.get('editar'); 


const carregarFornecedores = async () => {
    try {
        const resposta = await fetch('/api/fornecedores');
        if (resposta.ok) {
            const fornecedores = await resposta.json();
            const selectFornecedor = document.getElementById('id_fornecedor');
            
            // Limpa opções anteriores mantendo apenas a padrão
            selectFornecedor.innerHTML = '<option value="">Selecione um fornecedor...</option>';
            
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id_fornecedor; // Envia o número de ID para o banco
                option.textContent = fornecedor.nome;    // Mostra o nome na tela
                selectFornecedor.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar lista de fornecedores:", error);
    }
};


const preencherFormulario = async () => {
    try {
        const resposta = await fetch(`/api/insumos/${idInsumoEdicao}`);
        if (resposta.ok) {
            const insumo = await resposta.json();
            
            // Preenche cada input com o valor exato vindo da linha do banco
            document.getElementById('id_fornecedor').value = insumo.id_fornecedor; // Seleciona o ID correto no select
            document.getElementById('lote').value = insumo.lote;
            document.getElementById('data_validade').value = insumo.data_validade;
            document.getElementById('unidade_medida').value = insumo.unidade_medida;
            document.getElementById('nome_insumo').value = insumo.nome_insumo; // ID corrigido para bater com o HTML (nome_insumo)
            document.getElementById('id_categoria').value = insumo.id_categoria;
            document.getElementById('quantidade_estoque').value = insumo.quantidade_estoque;
            document.getElementById('estoque_minimo').value = insumo.estoque_minimo;
            document.getElementById('volume').value = insumo.volume;
        }
    } catch (error) {
        console.error("Erro ao buscar dados para preenchimento:", error);
    }
};

// Fluxo de Inicialização da Página
const iniciarPagina = async () => {
    
    await carregarFornecedores();
    
    // Se idInsumoEdicao existir, significa que o usuário veio pelo botão "Editar"
    if (idInsumoEdicao) {
        btnSubmeter.innerText = "Salvar Alterações";
        // Depois de popular o select, seleciona o item a ser editado
        await preencherFormulario();
    }
};

iniciarPagina();


form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar

    // Captura os valores digitados nos inputs e selects
    const id_fornecedor = document.getElementById('id_fornecedor').value;
    const lote = document.getElementById('lote').value;
    const data_validade = document.getElementById('data_validade').value;
    const unidade_medida = document.getElementById('unidade_medida').value;
    const nome_insumo = document.getElementById('nome_insumo').value; // Atualizado para capturar 'nome_insumo'
    const id_categoria = document.getElementById('id_categoria').value;
    const quantidade_estoque = parseFloat(document.getElementById('quantidade_estoque').value);
    const estoque_minimo = parseFloat(document.getElementById('estoque_minimo').value);
    const volume = document.getElementById('volume').value;

    // TRATAMENTO DE ERROS NO FRONT-END: Impede que números negativos passem
    if (quantidade_estoque < 0 || estoque_minimo < 0) {
        alert("Erro: As quantidades de estoque não podem ser negativas!");
        return; 
    }

    
    const dadosInsumo = {
        id_fornecedor,
        lote,
        data_validade,
        unidade_medida,
        nome_insumo,
        id_categoria,
        quantidade_estoque,
        estoque_minimo,
        volume,
        descricao: "" // Enviando vazio por padrão para não quebrar a ordem das colunas do banco
    };

    // INTELIGÊNCIA DE ROTAS: Define dinamicamente o link e o método da requisição
    let urlAPI = '/api/insumos';
    let metodoHTTP = 'POST';

    // Se estivermos editando, redireciona o fetch para a rota PUT com o ID correto
    if (idInsumoEdicao) {
        urlAPI = `/api/insumos/${idInsumoEdicao}`;
        metodoHTTP = 'PUT';
    }

    try {
        // Envia a requisição moldada dinamicamente
        const resposta = await fetch(urlAPI, {
            method: metodoHTTP,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosInsumo)
        });

        if (resposta.ok) {
            alert(idInsumoEdicao ? "Insumo atualizado com sucesso!" : "Insumo cadastrado com sucesso!");
            window.location.href = 'gerenciador.html'; // Redirecionamento de pagina
        } else {
            const erroServidor = await resposta.json();
            alert("Erro ao salvar no servidor: " + (erroServidor.error || "Tente novamente."));
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor.");
    }
});