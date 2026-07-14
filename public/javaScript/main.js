document.addEventListener('DOMContentLoaded', () => {
    // Busca os dados do usuário que foram guardados no login
    const idUsuarioLogado = localStorage.getItem('idUsuarioLogado') || 1;
    const nomeUsuarioLogado = localStorage.getItem('nomeUsuarioLogado') || "Usuário Desconhecido";

    
    const elementoUser = document.getElementById('user');
    
   
    if (elementoUser) {
        elementoUser.innerText = nomeUsuarioLogado;
    }
});