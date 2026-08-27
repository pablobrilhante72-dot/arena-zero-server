// Servidor multiplayer simples para o ARENA ZERO
// Sincroniza posição, rotação, tiros e vida entre todos os jogadores conectados.

const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });
console.log(`Servidor ARENA ZERO rodando na porta ${PORT}`);

// players[id] = { id, name, x, y, z, yaw, pitch, health, kills, ws }
const players = {};
let nextId = 1;

function broadcast(data, exceptId = null) {
  const msg = JSON.stringify(data);
  for (const id in players) {
    if (id == exceptId) continue;
    const p = players[id];
    if (p.ws.readyState === WebSocket.OPEN) p.ws.send(msg);
  }
}

wss.on('connection', (ws) => {
  const id = nextId++;
  players[id] = { id, name: `Player${id}`, x: 0, y: 1.7, z: 0, yaw: 0, pitch: 0, health: 100, kills: 0, ws };

  // avisa o novo jogador quem já está na sala
  ws.send(JSON.stringify({
    type: 'init',
    id,
    players: Object.values(players).map(p => ({ id: p.id, name: p.name, x: p.x, y: p.y, z: p.z, yaw: p.yaw, health: p.health, kills: p.kills }))
  }));

  // avisa todo mundo que alguém entrou
  broadcast({ type: 'player_joined', id, name: players[id].name }, id);

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    const p = players[id];
    if (!p) return;

    if (msg.type === 'set_name') {
      p.name = (msg.name || p.name).slice(0, 16);
      broadcast({ type: 'player_renamed', id, name: p.name }, id);
    }

    if (msg.type === 'move') {
      p.x = msg.x; p.y = msg.y; p.z = msg.z; p.yaw = msg.yaw; p.pitch = msg.pitch;
      broadcast({ type: 'player_move', id, x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch }, id);
    }

    if (msg.type === 'shoot') {
      broadcast({ type: 'player_shoot', id, dirX: msg.dirX, dirY: msg.dirY, dirZ: msg.dirZ }, id);
    }

    if (msg.type === 'hit') {
      const target = players[msg.targetId];
      if (target) {
        target.health -= msg.damage || 20;
        if (target.health <= 0) {
          target.health = 100; // respawn simples
          p.kills += 1;
          broadcast({ type: 'kill', killerId: id, killedId: target.id, killerKills: p.kills });
        } else {
          broadcast({ type: 'damage', targetId: target.id, health: target.health });
        }
      }
    }
  });

  ws.on('close', () => {
    delete players[id];
    broadcast({ type: 'player_left', id });
  });
});
