const Config = require('./config.json');

const CHRISTMAS_DAY = Config.general.christmasDay;

module.exports = {
    calculateChristmas: function () {
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
    },
}