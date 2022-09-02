const Builder = require('@discordjs/builders');
const Discord = require('discord.js');

const ChristmasCalc = require('../christmasCalc.js');

module.exports = {
    data: new Builder.SlashCommandBuilder()
        .setName('christmas')
        .setDescription('Display how many days till Christmas.'),
    async execute(client, interaction) {
        const timeLeft = ChristmasCalc.calculateChristmas();

        const file = new Discord.AttachmentBuilder('./christmas_tree.png');
        const embed = new Discord.EmbedBuilder()
            .setTitle('Christmas Countdown!')
            .setColor('#ea4630')
            .setThumbnail('attachment://christmas_tree.png')

        if (timeLeft === null) {
            embed.setDescription(`IT'S CHRISTMAS! :christmas_tree::christmas_tree::christmas_tree:`);
        }
        else {
            embed.setDescription(`**${timeLeft}**`);
        }

        const content = {
            embeds: [embed],
            files: [file]
        }

        console.log(`${interaction.user.username} just called the christmas command.`)
        await interaction.reply(content);
    },
};
