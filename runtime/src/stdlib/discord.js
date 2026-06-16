import { Client, GatewayIntentBits, Partials } from 'discord.js';
import * as log from './log.js';
import * as env from './env.js';

export function createBot(options = {}) {
  const token = options.token ?? env.require('DISCORD_TOKEN');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

  const handlers = { ready: [], message: [] };

  const bot = {
    token,
    user: null,
    on(event, handler) {
      if (!handlers[event]) handlers[event] = [];
      handlers[event].push(handler);
      return bot;
    },
    async connect() {
      log.info('Connecting to Discord...');

      client.once('ready', () => {
        bot.user = {
          id: client.user.id,
          tag: client.user.tag,
          username: client.user.username,
        };
        for (const handler of handlers.ready) {
          handler({ user: bot.user });
        }
      });

      client.on('messageCreate', async (message) => {
        const msg = wrapMessage(message, client);
        for (const handler of handlers.message) {
          await handler(msg);
        }
      });

      await client.login(token);
      log.info(`Bot online as ${client.user.tag}`);
    },
  };

  return bot;
}

function wrapMessage(message, client) {
  return {
    id: message.id,
    content: message.content,
    author: {
      id: message.author.id,
      username: message.author.username,
      bot: message.author.bot,
    },
    client: {
      latency: client.ws.ping,
    },
    async reply(content) {
      return message.reply(content);
    },
  };
}
