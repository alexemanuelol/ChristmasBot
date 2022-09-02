module.exports = {
    name: 'error',
    async execute(client, guild, error) {
        console.log(JSON.stringify(error));
        process.exit(1);
    },
}