const koa = require ('koa');

const http = require ('http');

//responsável pela comunicação em realTime SOCKET.IO
const socket = require('socket.io')

const app = new koa();

const PORT = 8080;

const HOST = 'localhost';

const server = http.createServer(app.callback());


const io = socket(server);

io.on('connection', socket => 
{
    console.log('[IO] Connection => Server has connection');
    //recebendo os dados do front  
    socket.on('newMessage', data => 
    {

        console.log("New Message ->", data);
        //Mandando a infomação de volata ao frontend
        io.emit('newMessage', data);
    })

    socket.on('disconnect', data => 
    {
        console.log(`Usuario desconectado`);
    })
})

server.listen(PORT, HOST, () => {
    console.log(`Servidor rodando -> http://${HOST}:${PORT}`);
})

//a funcionaidade do botão de logout eu não consegui realizar , sendo assim sempre que a página atuaiza o 
//backend dá a mensagem de usuário desconectado

//outra funcionalidade que tive grande dificuldade foi a de guardar as mensagens e renderizá-las assim que o user entrar
//pela primeira vez na sala