// Referencias HTML
const btnCrear = document.querySelector('button');
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');

const socket = io();



socket.on('connect', () => {
    // console.log('Conectado');

    btnCrear.disabled = false;

});

socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});


socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})


btnCrear.addEventListener( 'click', () => {

    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });

});