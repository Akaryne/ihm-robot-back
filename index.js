const socketIo = require('socket.io');
const http = require('http');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const server = http.createServer();
const io = socketIo(server, {cors: {origin: '*', methods: ['GET', 'POST']}});
const port = 8080;

const usbPort = new SerialPort({ path: 'COM6', baudRate: 9600 })
const parser = new ReadlineParser({ delimiter: '$' })
usbPort.pipe(parser)
const intervalle = 2000; 




function getSpeed() {
    if(usbPort){
        //console.log("Pending")
        //usbPort.write(`G0000$`)
    }
}


setInterval(getSpeed, intervalle);


io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté',socket.id);

    parser.on('data', (data) => {
        console.log(data)
        socket.emit("getSpeed",data)
    })

    socket.on('setSpeed', (data) => {
        usbPort.write(`S${data}$`)
    })

    socket.on('robotMode', (data) => {
        switch (data){
            case 0:
                console.log("Command send : A0000$")
                usbPort.write(`A0000$`)
                break
            case 1:
                console.log("Command send : M0000$")
                usbPort.write(`M0000$`)
                break
            case 2:
                console.log("Command send : C0000$")
                usbPort.write(`C0000$`)
                break
            default :
                break

        }
    })

    socket.on('commandRobot', (data) => {
        switch (data){
            case 1:
                console.log(`Direction : M000${data}$ = Avant `)
                usbPort.write(`M0001$`)
                break
            case 2:
                console.log(`Direction : M000${data}$ = Gauche `)
                usbPort.write(`M0002$`)
                break
            case 3:
                console.log(`Direction : M000${data}$ = Droite `)
                usbPort.write(`M0003$`)
                break
            case 4:
                console.log(`Direction : M000${data}$ = Arrière `)
                usbPort.write(`M0004$`)
                break
            case 0:
                console.log(`Direction : M000${data}$ = Arret `)
                usbPort.write(`M0000$`)
                break
            default :
                usbPort.write(`M0000$`)
                break   
        }
    })

    socket.on('disconnect', (data) => {
        console.log("Un utilisateur s'est déconnecté",socket.handshake.address);
        
    })

})


server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
  });