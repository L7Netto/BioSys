document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    const { error } = await window.supabase.from('usuarios').insert([dados]);

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
    } else {
        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html';
    }
});