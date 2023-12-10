const Discord = require('discord.js');
const Fs = require('fs');

const Config = require('./config.json');

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Discord.Collection();

const commandFiles = Fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = Fs.readdirSync(`${__dirname}/discordEvents`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./discordEvents/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.login(Config.discord.token).catch(error => {
    console.log(error)
});