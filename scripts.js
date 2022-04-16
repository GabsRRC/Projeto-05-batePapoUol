//LOGIN
    //conferir número de caracteres e disponibilidade do login
function validarLogin(){
    const login = document.querySelector(".nome-usuario").value;
    if (login.length >= 4){
        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: login});
        promise.then(entrarBatepapo);
        promise.catch(mostrarErroLogin);
    } else {
        alert('O nome escolhido deve ter no mínimo quatro letras \n Escolha nome outro e tente novamente');
    }
}
    // mostrar error
function mostrarErroLogin(){
    alert('Este nome já está em uso!\n Escolha outro nome e tente novamente');
}
    // entrar na sala de bate bapo
function entrarBatepapo(){
    const escondeTelaLogin = document.querySelector(".tela-entrada");
    escondeTelaLogin.classList.add("escondido");
    const mostraTelaChat = document.querySelector(".tela-chat");
    mostraTelaChat.classList.remove("escondido");
    refreshAPI();
}

function refreshAPI(){
    setInterval(enviarStatus, 5000);
    setInterval(atualizarMensagens, 3000);
    setInterval(atualizarParticipantes, 10000);
    setInterval(barraFinalzinho, 200);
}

//CHAT
    //status do participante
function enviarStatus(){
    const login = document.querySelector(".nome-usuario").value;
    const onlineRoteando = {
        name: login,
    }
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', onlineRoteando);
    promise.then(mandarConectado);
    promise.catch(mandarDesconectado);
}

function mandarConectado(){
    //tudo okay
}

function mandarDesconectado(){
    alert('Erro!\n Não foi possível manter a conexão! Entre novamente')
    usuarioOff();
}

    //abrir ou fechar aba de participantes
function alternarAbaParticipantes (){
    const mostraParticipantes = document.querySelector(".tela-participantes");
    mostraParticipantes.classList.toggle("escondido");
}

function atualizarParticipantes(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(renderizarParticipantes);
}

function renderizarParticipantes(promise){
    deletarListaAntiga();
    let ativos = promise.data
    for (let i = 0; i < ativos.length; i++) {
        montarParticipantes(ativos[i].name);
}
}

function montarParticipantes(name){
    const lista = document.querySelector('.lista-contatos')
        lista.innerHTML += `<div onclick="selecionarDestinatario(this)" class="box-contato">
            <ion-icon name="person-circle"></ion-icon>
        <p class="destinatario">${name}</p>
        <div class="check">
            <ion-icon name="checkmark"></ion-icon>
        </div>
        </div>`
}

function deletarListaAntiga(){
    document.querySelector('.lista-contatos').innerHTML = ''
    const resetDest = document.querySelector('.inicial');
    resetDest.classList.add('selecionado');
}


function selecionarTipo(tipo){
    const tipoSelecionado = document
    .querySelector(".privacidade")
    .querySelector(".selecionado");

    if (tipoSelecionado !== null){
        tipoSelecionado.classList.remove("selecionado")
    }  
    tipo.classList.toggle("selecionado")
}



function selecionarDestinatario(destinatario){
    const destinatarioSelecionado = document
    .querySelector(".quem")
    .querySelector(".selecionado");

    if (destinatarioSelecionado !== null){
        destinatarioSelecionado.classList.remove("selecionado")
    }  
    destinatario.classList.toggle("selecionado")
    barraFinalzinho(destinatarioSelecionado);
}


function barraFinalzinho (){
    const destinatarioSelecionado = document.querySelector(".selecionado .destinatario").innerHTML;
    const visibilidade = document.querySelector(".box-tipo.selecionado .tipo").innerHTML
    if (visibilidade === 'Reservadamente'){
        document.querySelector(".digitando").innerHTML = `Digitando para ${destinatarioSelecionado} (reservadamente)`
    } else{
        document.querySelector(".digitando").innerHTML = `Digitando para ${destinatarioSelecionado}` 
    }
}


    //enviar mensagem

function enviarMensagem() {
    const text = document.querySelector(".minha-mensagem").value;
    const login = document.querySelector(".nome-usuario").value;
    const visibilidade = document.querySelector(".box-tipo.selecionado .tipo").innerHTML
    const quem = document.querySelector(".box-contato.selecionado .destinatario").innerHTML

    if (visibilidade === 'Reservadamente'){
        const minhaMensagem = {
            from: login,
            to: quem,
            text: text,
            type: 'private_message',
        };
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', minhaMensagem);
        promise.then(enviarMensagemThen);
        promise.catch(enviarMensagemCatch);
    } else {
        const minhaMensagem = {
            from: login,
            to: quem,
            text: text,
            type: 'message',
        };
          
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', minhaMensagem);
        promise.then(enviarMensagemThen);
        promise.catch(enviarMensagemCatch); 
    }
    
}

function enviarMensagemThen(){
    document.querySelector('.minha-mensagem').value = ''
    atualizarMensagens();
}

function enviarMensagemCatch(){
    alert("xiii");
    usuarioOff();
    //função de reload
}

    //receber mensagem
function atualizarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(renderizarMensagens);
}
    
function renderizarMensagens(promise) {
    deletarMensagensAntigas();
    let chatLive = promise.data
    for (let i = 0; i < chatLive.length; i++) {
        montarMensagens(chatLive[i].from, chatLive[i].to, chatLive[i].text, chatLive[i].type, chatLive[i].time)
    }
}
    
function deletarMensagensAntigas() {
    document.querySelector('.chat-display').innerHTML = ''
}

function montarMensagens(from, to, text, type, time) {
    const mensagem = document.querySelector('.chat-display');
    const login = document.querySelector(".nome-usuario").value;    
    if (type === 'status') {
        mensagem.innerHTML += `
        <div class="message status">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span>
            <span class = 'span-message'>
            ${text}</p></span>
        </div>`
    }
    if (type === 'message') {
        mensagem.innerHTML += `
        <div class="message">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span> para<span class = 'span-user'>${to}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>`
    }
    if (type === 'private_message'&& (to === login|| to === 'Todos'|| from ===login)) {
        mensagem.innerHTML += `
        <div class="message private">
            <p><span class = 'span-time'>
            (${time})</span> 
            <span class = 'span-user'> ${from}</span>
            reservadamente para<span class = 'span-user'>${to}</span>:
            <span class = 'span-message'>
            ${text}</p></span>
        </div>`
    }
    scrollAutomatico();
}

function scrollAutomatico() {
    const todasMensagens = document.querySelectorAll(".chat-display div")
    const ultimaMensagem = todasMensagens[todasMensagens.length - 1];
    ultimaMensagem.scrollIntoView();
  }

function usuarioOff() {
    window.location.reload();
}
  