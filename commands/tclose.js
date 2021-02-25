//INIT LIBRARIES
const Discord = require('discord.js');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMISSION
    if (!msg.member.roles.cache.has("807670565401002075")) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Offenbar fehlen dir Berechtigungen um den Befehl `" + msg.content.split(" ")[0] + "` ausführen zu können:\n`" + this.help.permission + "`")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //CHECK IF CHANNEL IS TICKET
    if (!msg.channel.name.startsWith("ticket-")) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Dieser Channel ist offenbar kein Ticket 🤔 Du kannst nur Tickets mit diesem Befehl löschen!")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //REMOVE CHANNEL AND SEND USER MESSAGE
    await msg.channel.delete();
    msg.author.send("Ticket erfolgreich geschlossen!");

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "tclose",
    description: "Schließt ein Support Ticket!",
    usage: "",
    permission: "ROLES_TEAM"

}