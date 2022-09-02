const Discord = require('discord.js');
const Rest = require('@discordjs/rest');
const Types = require('discord-api-types/v9');
const Builder = require('@discordjs/builders');
const Voice = require('@discordjs/voice');
const GetMP3Duration = require('get-mp3-duration');
const Fs = require('fs');

const DISCORD_APP = '';
const DISCORD_TOKEN = '';

const CHRISTMAS_DAY = 24;
const CHRISTMAS_TREE = 'https://toppng.com/uploads/preview/christmas-trees-11607028718sbqxewfke3.png';


const christmasSlashCommand = {
    data: new Builder.SlashCommandBuilder()
        .setName('christmas')
        .setDescription('Display how many days till Christmas.'),
    async execute(client, interaction) {
        const timeLeft = calculateChristmas();

        const embed = new Discord.EmbedBuilder()
            .setTitle('Christmas Countdown!:christmas_tree:')
            .setColor('#ea4630')
            .setThumbnail(CHRISTMAS_TREE)

        if (timeLeft === null) {
            embed.setDescription(`IT'S CHRISTMAS! :christmas_tree::christmas_tree::christmas_tree:`);
        }
        else {
            embed.setDescription(`**${timeLeft}**`);
        }

        const content = {
            embeds: [embed]
        }

        console.log(`${interaction.user.username} just called the christmas command.`)
        await interaction.reply(content);
    }
};

const merryChristmasSlashCommand = {
    data: new Builder.SlashCommandBuilder()
        .setName('merrychristmas')
        .setDescription('Merry Christmas player.'),
    async execute(client, interaction) {
        const channelId = interaction.member.voice.channelId;
        if (channelId === null) {
            await interaction.reply({
                content: 'You are not currently in a voice channel.',
                ephemeral: true
            });
            return;
        }

        const connection = Voice.joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        const resource = Voice.createAudioResource('merry_christmas.mp3', { inlineVolume: true });

        const player = Voice.createAudioPlayer();
        connection.subscribe(player);
        player.play(resource)

        const buffer = Fs.readFileSync('merry_christmas.mp3');
        const duration = GetMP3Duration(buffer);

        const guildId = interaction.guildId;

        setTimeout(() => {
            Voice.getVoiceConnection(guildId).disconnect();
        }, duration + 2000);

        await interaction.reply({
            content: 'Joined voice channel to wish you Merry Christmas!:christmas_tree:',
            ephemeral: true
        });
    }
};


const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});
client.commands = new Discord.Collection();
client.commands.set('christmas', christmasSlashCommand);
client.commands.set('merrychristmas', merryChristmasSlashCommand);

client.once('ready', async client => {
    console.log('LOGGED IN AS: ' + client.user.tag);
    client.user.setUsername('ChristmasBot');

    client.user.setActivity('/help', { type: 'LISTENING' });

    client.guilds.cache.forEach(async (guild) => {
        guild.members.me.setNickname('ChristmasBot');
        await registerSlashCommands(guild);
    });
});

client.on('interactionCreate', async interaction => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const command = interaction.client.commands.get(interaction.commandName);

        /* If the command doesn't exist, return */
        if (!command) return;

        try {
            await command.execute(client, interaction);
        }
        catch (error) {
            console.log(error);
        }
    }
});

async function registerSlashCommands(guild) {
    const commands = [];
    commands.push(christmasSlashCommand.data.toJSON());
    commands.push(merryChristmasSlashCommand.data.toJSON());

    const rest = new Rest.REST({ version: '9' }).setToken(DISCORD_TOKEN);

    try {
        await rest.put(Types.Routes.applicationGuildCommands(DISCORD_APP, guild.id), { body: commands });
    }
    catch (e) {
        console.log(`Could not register Slash Commands for guild: ${guild.id}. ` +
            'Make sure applications.commands is checked when creating the invite URL.');
        process.exit(1);
    }
    console.log(`Successfully registered application commands for guild: ${guild.id}.`)
}


function calculateChristmas() {
    const now = new Date();

    const currentMonth = (now.getMonth() + 1); /* January = 0 */
    const currentDay = now.getDate();

    if (currentMonth === 12 && currentDay === CHRISTMAS_DAY) {
        return null;
    }

    let nextChristmasYear = now.getFullYear();
    if (currentMonth === 12 && currentDay > CHRISTMAS_DAY) {
        nextChristmasYear = nextChristmasYear + 1;
    }

    const nextChristmasDate = nextChristmasYear + `-12-${CHRISTMAS_DAY}T00:00:00.000Z`;
    const christmasDay = new Date(nextChristmasDate);

    let diffSeconds = Math.floor((christmasDay.getTime() - now.getTime()) / 1000);

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    days = Math.floor(diffSeconds / (3600 * 24));
    diffSeconds -= days * 3600 * 24;
    hours = Math.floor(diffSeconds / 3600);
    diffSeconds -= hours * 3600;
    minutes = Math.floor(diffSeconds / 60);
    diffSeconds -= minutes * 60;
    seconds = diffSeconds;

    let str = '';
    if (days !== 0) str += `${days} Days `;
    if (hours !== 0) str += `${hours} Hours `;
    if (minutes !== 0) str += `${minutes} Minutes `;
    if (seconds !== 0) str += `${seconds} Seconds `;

    return str;
}


client.login(DISCORD_TOKEN).catch(error => {
    console.log(error)
});
