//INIT LIBRARIES
const Discord = require('discord.js');
const Process = require("process");

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMISSION
    if (!msg.member.permissions.has("ADMINISTRATOR")) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Offenbar fehlen dir Berechtigungen um den Befehl `" + msg.content.split(" ")[0] + "` ausführen zu können:\n`" + this.help.permission + "`")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    await msg.react("🤯");
    await bot.user.setStatus("invisible");
    Process.kill(0);

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "kill",
    description: "Stoppt den Bot!",
    usage: "",
    permission: "ADMINISTRATOR"

}