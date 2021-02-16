//INIT LIBRARIES
const Discord = require('discord.js');
const Pterodactyl = require('nodeactyl');
const mc_server = Pterodactyl.Application;

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //VARIABLES FROM PTERODACTYL -> NORMAL STATES WHEN NO ANSWER FROM PTERODACTYL
    let cpu = 1;
    let ram = 1;
    let maxRam = 0;
    let nowRam = 0;

    //FUNCTION FOR BUILDING USAGE BARS
    function getUsageBar(usage) {

        let i = 30; // input 1 -> width
        let p = usage; // input 2 -> percent complete
        let o = i / 2 | 0; // half of i, without any decimal places
        let f = i - i * p; // how far along the bar to draw spaces
        let x = ['[']; // start an array
        while(i--){ // while i > 0
            x.push( // add to the array
                (i < f ? ' ' : '#') // a space, or | depending on how far along the bar we are
                + (i - o ? '' : p * 100 + '%')); // and if we're halfway, add the percentage complete
        }

        return x.join('') + ']';

    }

    //MAKE USAGE BARS
    let cpu_usage = getUsageBar(cpu);
    let ram_usage = getUsageBar(ram);

    //BUILD EMBED
    let embed = new Discord.MessageEmbed()
        .setTitle("Serverauslastung vom Minecraft Server")
        .setThumbnail(bot.user.avatarURL())
        .setFooter("Befehl ausgeführt durch: " + msg.author.tag)
        .addField("CPU Auslastung", cpu_usage)
        .addField("RAM Auslastung", ram_usage + "\n" + nowRam + "MB von " + maxRam + "MB");

    msg.channel.send(embed);

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "status",
    description: "Zeigt den aktuellen Status über den Minecraft Server",
    usage: "",
    permission: "keine"

}