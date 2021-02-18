//INIT LIBRARIES
const Discord = require('discord.js');
const Pterodactyl = require('nodeactyl-beta');
const mc_server = new Pterodactyl.NodeactylClient("http://45.88.110.213:8089", "BwELET7P7BbEdwnB0O1K8fNUFAmvOacZMvY4CUITWpMnrTwZ");

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //VARIABLES FROM PTERODACTYL -> NORMAL STATES WHEN NO ANSWER FROM PTERODACTYL
    let cpu = 1;
    let maxRam = 1;
    let nowRam = 1;
    let status = "no_connection"

    //LOGIN TO GET SERVER INFO
    await mc_server.getServerUsages("a89ccb98").then(result => {

        cpu = result.resources.cpu_absolute;
        nowRam = (result.resources.memory_bytes / (1024*1024)).toFixed(0);
        status = result.current_state;

    });

    await mc_server.getServerDetails("a89ccb98").then(result => {

        maxRam = result.limits.memory;

    })

    let ram = (nowRam / maxRam).toFixed(4);

    //FUNCTION: "MAKEPROGRESSBAR" FOR USAGE FROM SERVER IN EMBED
    function makeProgressbar(value) {

        let a = value, // console inputs
            i = 30, // input 1 -> width
            p = a, // input 2 -> percent complete
            o = i / 2 | 0, // half of i, without any decimal places
            f = i - i * p, // how far along the bar to draw spaces
            x = ['[']; // start an array
        while(i--){ // while i > 0
            x.push( // add to the array
                (i < f ? ' ' : '=') // a space, or | depending on how far along the bar we are
                + (i - o ? '' : p * 100 + '%')); // and if we're halfway, add the percentage complete
        }
        return x.join('') + ']'; // then write out the array as a string, with a trailing ]

    }

    //BUILD EMBED
    const embed = new Discord.MessageEmbed()
        .setTitle("Aktuelle Auslastung Minecraft Server")
        .setThumbnail(bot.user.avatarURL())
        .setColor("#" + Math.floor(Math.random()*16777215).toString(16))
        .addField("Status", status)
        .addField("CPU Auslastung", makeProgressbar(cpu / 100))
        .addField("RAM Auslastung", makeProgressbar(ram))
        .addField("RAM Verbrauch", nowRam + "MB von " + maxRam + "MB");

    msg.channel.send(embed);

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "status",
    description: "Zeigt den aktuellen Status über den Minecraft Server",
    usage: "",
    permission: "keine"

}