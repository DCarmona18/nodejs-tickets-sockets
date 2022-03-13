const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    // Cliente se conecta
    socket.emit("ultimo-ticket", ticketControl.ultimo);
    socket.emit("estado-actual", ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on("disconnect", () => {
        // console.log('Cliente desconectado', socket.id );
    });

    socket.on("siguiente-ticket", (payload, callback) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        //TODO: Notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on("atender-ticket", (payload, callback) => {
        const { escritorio } = payload;
        if (!escritorio) {
            return callback({
                ok: false,
                msg: "El escritorio es obligatorio",
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if (!ticket) {
            return callback({
                ok: false,
                msg: "Ya no hay tickets pendientes",
            });
        }

        return callback({
            ok: true,
            ticket,
        });
    });
};

module.exports = {
    socketController,
};
