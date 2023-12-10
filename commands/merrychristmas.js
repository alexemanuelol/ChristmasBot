
const Builder = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new Builder.SlashCommandBuilder()
        .setName('merrychristmas')
        .setDescription('Wish everyone a Merry Christmas ho ho ho!'),
    async execute(client, interaction) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        await interaction.deferReply();

        /* Join the user's voice channel */
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        try {
            /* Create an audio player and play the MP3 file */
            const audioPlayer = createAudioPlayer();
            const resource = createAudioResource('merrychristmas.mp3');

            audioPlayer.play(resource);
            connection.subscribe(audioPlayer);

            /* Leave the voice channel after 6 seconds */
            setTimeout(() => {
                connection.destroy();
            }, 6000);

            interaction.editReply('Wishing everyone a Merry Christmas Ho Ho Ho!');
        }
        catch (error) {
            console.error(error);
            interaction.editReply('There was an error playing the audio.');
        }
    },
};
