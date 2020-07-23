const path = require('path');
const http = require('http');
const express = require('express');
const nunjucks = require('nunjucks');
const Redis = require('ioredis');
const reload = require('reload');
const socketIo = require('socket.io');

const app = express();
const redis = new Redis();
const redisSub = new Redis();
const port = process.env.PORT || 2434;
const websocketServer = process.env.WS_SERVER || `http://localhost:${port}`;
const REDIS_KEY = 'despair';

app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
});

app.get('/', async (req, res) => {
  try {
    redis.incr('despair-visits');
    const despairAmount = await redis.get(REDIS_KEY);
    res.render('index.njk', { despairAmount, websocketServer });
  } catch (e) {
    console.error('Something went wrong', e);
  }
});

const server = http.createServer(app);
const io = socketIo(server);
redisSub.psubscribe('__keyspace@0__:*');
redisSub.on('pmessage', async () => {
  try {
    const despairAmount = await redis.get(REDIS_KEY);
    io.emit('despair', despairAmount);
  } catch (e) {
    console.error('Failed to send websocket event.', e);
  }
});

reload(app).then(() => {
  server.listen(port, () => {
    console.log(`Listening on port ${port}! http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Reload could not start, could not start server app', err);
});
