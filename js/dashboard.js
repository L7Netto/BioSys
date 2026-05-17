async function carregarDashboard() {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user) return window.location.href = 'login.html';
    
    document.querySelectorAll('#nome-usuario').forEach(el => el.innerText = user.nome);

    const { data: laudos, error: errL } = await window.supabase
        .from('laudos')
        .select('*')
        .eq('usuario_id', user.id);

    if (errL) return console.error("Erro Laudos:", errL);

    const tAtuais = document.getElementById('tabela-atuais');
    const tHist = document.getElementById('tabela-historico');
    tAtuais.innerHTML = ""; tHist.innerHTML = "";

    for (const l of laudos) {
        const { data: itens } = await window.supabase
            .from('itens_laudo')
            .select('exame_id, resultado')
            .eq('laudo_id', l.id)
            .maybeSingle();

        let nomeExame = "Exame Geral";

        if (itens?.exame_id) {
            const { data: ex } = await window.supabase
                .from('exames')
                .select('nome')
                .eq('id', itens.exame_id)
                .maybeSingle();
            if (ex) nomeExame = ex.nome;
        }

        const data = new Date(l.data_solicitacao).toLocaleDateString('pt-BR');
        const res = l.resultado || itens?.resultado || "---";
        const isPend = l.status === 'pendente';

        const html = `<tr>
            <td>${nomeExame}</td>
            <td>${data}</td>
            <td>${isPend ? '<span class="status-pendente">Em análise</span>' : `<strong>${res}</strong>`}</td>
            ${!isPend ? '<td><button class="btn-ver">Ver</button></td>' : ''}
        </tr>`;

        if (isPend) tAtuais.innerHTML += html;
        else tHist.innerHTML += html;
    }
}


function logout() {
    localStorage.removeItem("usuario");
    window.location.replace('login.html');
}


document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-sair' || e.target.classList.contains('btn-sair')) {
        logout();
    }
});

carregarDashboard();