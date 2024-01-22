import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { checkForLobby, findLobby } from './logic';
dotenv.config();
const app = express();
app.use(cors());
const server = http.createServer(app);
const ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
    cors: {
        origin: ORIGIN,
        methods: ['GET', 'POST']
    }
});
const lobbies = [];
const playerToSocket = new Map();
io.on('connection', (socket) => {
    socket.on('playOnline', (playerID) => {
        console.log(`${playerID} is playing online`);
        playerToSocket.set(playerID, socket.id);
        const lobbyID = checkForLobby(lobbies, playerID);
        if (lobbyID) {
            socket.join(lobbyID);
        }
        const currentLobby = findLobby(playerID, lobbies);
        if (currentLobby && currentLobby.playerX && currentLobby.playerO) {
            console.log('Creating Game');
            if (playerToSocket.get(currentLobby.playerX)) {
                io.to(playerToSocket.get(currentLobby.playerX)).emit('gameFound', 'X');
            }
            if (playerToSocket.get(currentLobby.playerO)) {
                io.to(playerToSocket.get(currentLobby.playerO)).emit('gameFound', 'O');
            }
        }
    });
    socket.on('sendMovement', (newData, playerID) => {
        console.log('Movement Sent');
        console.log('Player ID:', playerID);
        console.log('Lobbies:', lobbies);
        const currentLobby = findLobby(playerID, lobbies);
        console.log(`Movement in ${currentLobby} lobby`);
        if (currentLobby) {
            io.in(currentLobby.lobbyID).emit('recieveMovement', newData);
        }
    });
    socket.on('playerDisconnected', (playerID) => {
        console.log(`${playerID} is leaving the game`);
        const currentLobby = findLobby(playerID, lobbies);
        if (currentLobby && currentLobby.playerO && currentLobby.playerX) {
            console.log(`${currentLobby.playerO} and ${currentLobby.playerX} are leaving the game`);
            if (currentLobby.playerX === playerID) {
                console.log('O wins by default');
                io.to(playerToSocket.get(currentLobby.playerO)).emit('winByDefault', 'O');
                currentLobby.playerX = undefined;
            }
            else if (currentLobby.playerO === playerID) {
                console.log('X wins by default');
                io.to(playerToSocket.get(currentLobby.playerX)).emit('winByDefault', 'X');
                currentLobby.playerO = undefined;
            }
        }
        playerToSocket.delete(playerID);
        socket.leave(currentLobby === null || currentLobby === void 0 ? void 0 : currentLobby.lobbyID);
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
