module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('LOGGED IN AS: ' + client.user.tag);
        client.user.setUsername('ChristmasBot');

        try {
            await client.user.setAvatar('./christmas_tree.png');
        }
        catch (e) {
            console.log('Ignored changing avatar.');
            console.log(e)
        }

        client.user.setActivity('/help', { type: 'LISTENING' });

        client.guilds.cache.forEach(async (guild) => {
            guild.members.me.setNickname('ChristmasBot');
            await require('../RegisterSlashCommands')(client, guild);
        });
    },
};