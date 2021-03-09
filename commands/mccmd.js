//INIT LIBRARIES
const Discord = require('discord.js');
const Pterodactyl = require("nodeactyl-beta");
const SETTINGS = require("../settings");
const mc_server = new Pterodactyl.NodeactylClient("http://ptero.galaxycrow.de/", SETTINGS.variables.TOKEN.PTERODACTYL);

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

//CHECK PERMISSION
    if (!msg.member.permissions.has("PRIORITY_SPEAKER")) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Offenbar fehlen dir Berechtigungen um den Befehl `" + msg.content.split(" ")[0] + "` ausführen zu können:\n`" + this.help.permission + "`")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //CHECK IF THERE IS ARGS
    if (!args[0]) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Bitte gebe mind. einen Parameter an!\nUsage: " + bot.PREFIX + this.help.name + " " + this.help.usage)
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //SEND COMMAND AND LOOK WHATS HAPPEN
    await mc_server.sendServerCommand("a89ccb98", args.join(" ")).then(response => {
        if(response) { msg.react("✅"); } else { msg.react("❌"); }
    })

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "mccmd",
    description: "Sendet einen Befehl an den Minecraft Server",
    usage: "<String cmd> <String[] args>",
    permission: "PRIORITY_SPEAKER"

}