document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Busca o usuário na tabela unificada 'usuarios' filtrando por email e senha
    const { data: usuario, error } = await window.supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .maybeSingle();

    if (usuario) {
        localStorage.clear(); // Limpa dados de logins anteriores

        // Se o tipo for 'biomedico', salva e manda para a tela técnica do laboratório
        if (usuario.tipo === 'biomedico') {
            localStorage.setItem("biomedico", JSON.stringify(usuario));
            return window.location.href = 'painel-biomedico.html'; 
        } 
        
        // Se o tipo for 'paciente', salva e manda para o painel de resultados dele
        if (usuario.tipo === 'paciente') {
            localStorage.setItem("usuario", JSON.stringify(usuario));
            return window.location.href = 'dashboard-paciente.html';
        }
    }

    // Se não encontrou o usuário ou as credenciais estão erradas
    alert("E-mail ou senha incorretos!");
});