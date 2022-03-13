const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
    window.location = "index.html";
    throw new Error("El escritorio es obligatorio");
}

// Referencias HTML
const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;
divAlerta.style.display = "none";
lblPendientes.innerText = '0';

const socket = io();

socket.on("connect", () => {
    // console.log('Conectado');

    btnAtender.disabled = false;
});

socket.on("disconnect", () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
    lblPendientes.style.display = '';
    divAlerta.style.display = 'none';
    lblPendientes.innerText = payload;
});

btnAtender.addEventListener("click", () => {
    socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
        if (!ok) {
            lblTicket.innerText = 'nadie';
            lblPendientes.style.display = 'none';
            return divAlerta.style.display = "";
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`;
    });
});
