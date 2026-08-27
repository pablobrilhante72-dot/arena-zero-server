# Servidor Multiplayer — ARENA ZERO

Este é o servidor que permite você e seus amigos jogarem juntos pela internet.
Ele não fica rodando sozinho no seu computador o tempo todo — você precisa
"publicar" ele em um serviço gratuito. Veja o passo a passo abaixo.

## O que esse servidor faz

Ele recebe a posição, mira e tiros de cada jogador conectado e retransmite
para todos os outros, em tempo real, via WebSocket. É o "cérebro" que
sincroniza todo mundo na mesma partida.

## Passo a passo para colocar no ar (grátis)

### Opção recomendada: Render.com

1. Crie uma conta grátis em https://render.com
2. Crie um repositório no GitHub com estes 3 arquivos (`server.js`,
   `package.json`, este `README.md`)
3. No Render, clique em "New +" → "Web Service"
4. Conecte seu repositório do GitHub
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Clique em "Create Web Service"
7. Em alguns minutos você recebe uma URL tipo:
   `wss://arena-zero-server.onrender.com`

Essa URL é o endereço que o jogo vai usar para conectar todos os jogadores.

### Alternativas equivalentes
- Railway.app
- Fly.io
- Um VPS próprio (mais avançado)

## Próximo passo

Depois que você tiver a URL do servidor rodando, me avise aqui que eu
conecto o jogo (`fps-game.html`) a esse servidor — isso significa adicionar
o código de rede no cliente para que ele:
- Envie sua posição/mira/tiros pro servidor
- Receba e desenhe os outros jogadores na tela em tempo real

Isso é a próxima fase depois que você validar o protótipo single-player.
