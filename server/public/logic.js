import { randomUUID } from 'crypto';
export function checkForLobby(lobbies, playerID) {
    console.log(lobbies);
    const userAlreadyInLobby = lobbies.find(lobby => {
        return lobby.playerO === playerID || lobby.playerX === playerID;
    });
    if (userAlreadyInLobby)
        return userAlreadyInLobby.lobbyID;
    const availableLobby = lobbies.find((lobby) => {
        console.log(`${lobby.playerX}  ${lobby.playerO}`);
        return lobby.playerX === undefined || lobby.playerO === undefined;
    });
    if (availableLobby) {
        console.log('Found Available lobby');
        if (!availableLobby.playerX) {
            availableLobby.playerX = playerID;
        }
        else if (!availableLobby.playerO) {
            availableLobby.playerO = playerID;
        }
        return availableLobby.lobbyID;
    }
    else {
        console.log('creating new lobby');
        const newLobby = {
            lobbyID: randomUUID(),
            playerX: playerID,
            playerO: undefined
        };
        lobbies.push(newLobby);
        return newLobby.lobbyID;
    }
}
export function findLobby(playerID, lobbies) {
    return lobbies.find(lobby => lobby.playerO === playerID || lobby.playerX === playerID);
}
