const form = document.getElementById('form-login');

async function validarLogin(event) {
    event.preventDefault(); // Impede o recarregamento da página
    
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const campoErro = document.getElementById('mensagem-erro');

    // Faz o envio para o servidor e aguarda a resposta
    const resposta = await fetch('/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    // Converção da resposta do servidor para JSON 
    const dados = await resposta.json();

    if (resposta.ok) {
        // Cenário de Sucesso (Status 200)
        campoErro.textContent = ""; 
        window.location.href = '/main.html'; 
    } else {
        // Cenário de Erro (Status 401 ou 500)
        // Injeta a mensagem que veio do seu servidor ("Usuário ou senha inválidos") 
        campoErro.textContent = dados.mensagem; 
        
        // Limpeza do campo de senha
        document.getElementById('senha').value = "";
    }
}


form.addEventListener('submit', validarLogin);