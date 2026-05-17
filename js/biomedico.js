// 1. Inicia tudo ao abrir a página
window.onload = () => {
    carregarDados();
    carregarPendentes();
};

// 2. Preenche os Selects (Pacientes e Exames)
async function carregarDados() {
    const { data: p } = await window.supabase.from('usuarios').select('id, nome');
    const { data: e } = await window.supabase.from('exames').select('id, nome');
    
    const selectPaciente = document.getElementById('select-paciente');
    const selectExame = document.getElementById('select-exame');

    // Limpa antes de preencher e evita travar se o elemento sumir do HTML
    if (selectPaciente) {
        selectPaciente.innerHTML = '<option value="">Selecione o Paciente</option>';
        p?.forEach(pac => selectPaciente.innerHTML += `<option value="${pac.id}">${pac.nome}</option>`);
    }
    
    if (selectExame) {
        selectExame.innerHTML = '<option value="">Selecione o Exame</option>';
        e?.forEach(ex => selectExame.innerHTML += `<option value="${ex.id}">${ex.nome}</option>`);
    }
}

// 3. Mostra os exames na tabela
async function carregarPendentes() {
    const { data: laudos } = await window.supabase.from('laudos').select('*, usuarios(nome)').eq('status', 'pendente');
    const tabela = document.getElementById('tabela-pendentes');
    
    if (!tabela) return; // Proteção para não quebrar o código se a tabela mudar de ID

    if (!laudos || laudos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Nenhum exame pendente encontrado.</td></tr>`;
        return;
    }
    
    tabela.innerHTML = laudos.map(l => `
        <tr>
            <td style="font-weight: 600;">${l.usuarios?.nome || 'Paciente'}</td>
            <td><span class="status-pendente">Exame</span></td>
            <td>${new Date(l.data_solicitacao).toLocaleDateString('pt-BR')}</td>
            <td><input type="number" id="res-${l.id}" class="input-resultado" placeholder="0.0"></td>
            <td><button class="btn-ver" onclick="finalizar('${l.id}')">OK</button></td>
        </tr>`).join('');
}

// 4. Cria nova ordem
async function criarSolicitacao() {
    const u = document.getElementById('select-paciente').value;
    const e = document.getElementById('select-exame').value;
    
    if (!u || !e) {
        alert("Por favor, selecione um paciente e um exame!");
        return;
    }

    const { data: n } = await window.supabase.from('laudos').insert([{ usuario_id: u, status: 'pendente' }]).select();
    await window.supabase.from('itens_laudo').insert([{ laudo_id: n[0].id, exame_id: e }]);
    
    alert("Ordem de exame criada com sucesso!"); 
    carregarPendentes();
}

// 5. Salva resultado
async function finalizar(id) {
    const r = document.getElementById(`res-${id}`).value;
    if (!r) {
        alert("Insira um resultado antes de finalizar!");
        return;
    }
    await window.supabase.from('laudos').update({ resultado: r, status: 'finalizado' }).eq('id', id);
    alert("Resultado salvo e exame finalizado!"); 
    carregarPendentes();
}

// 6. Sair
function sairDoSistema() { 
    localStorage.clear(); 
    window.location.href = 'login.html'; 
}