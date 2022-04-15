//LOGIN
    //conferir número de caracteres e disponibilidade do login
function validarLogin(){
    const login = document.querySelector(".nome-usuario").value;
    if (login.length >= 4){
        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: login});
        promise.then(entrarBatepapo);
        promise.catch(mostrarErroLogin);
    } else {
        alert('inválido, nome curto, no mínimo quatro letras');
    }
}
    // mostrar error
function mostrarErroLogin(){
    alert('deu ruim');
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
    setInterval(atualizarMensagens, 5000);
    setInterval(atualizarParticipantes, 10000);
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
    alert('erro')
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
        promise.then(enviarMensagem2);
        promise.catch(enviarMensagem3);
    } else {
        const minhaMensagem = {
            from: login,
            to: quem,
            text: text,
            type: 'message',
        };
          
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', minhaMensagem);
        promise.then(enviarMensagem2);
        promise.catch(enviarMensagem3); 
    }
}

function enviarMensagem2(){
    document.querySelector('.minha-mensagem').innerHTML = ''
    alert("enviada mensagem");
}

function enviarMensagem3(){
    alert("xiii");
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
    const mensagem = document.querySelector('.chat-display')
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
}

