//INIT LIBRARIES
const Discord = require('discord.js');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMISSION
    if (!msg.member.permissions.has("MANAGE_MESSAGES")) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Offenbar fehlen dir Berechtigungen um den Befehl `" + msg.content.split(" ")[0] + "` ausführen zu können:\n`" + this.help.permission + "`")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //CHECK IF THERE IS ARGS
    if (!args[0]) {

        args[0] = 100;

    }

    //CHECK IF ARGS IS NUMBER
    if (parseInt(args[0]) <= 0) {
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Der angegebene Parameter `" + args[0] + "` ist keine Zahl über 0! Bitte überprüfe die Eingabe!\nUsage: " + bot.PREFIX + this.help.name + " " + this.help.usage)
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    if (parseInt(args[0]) > 99) args[0] = 99;

    //DELETE MESSAGES
    await msg.channel.bulkDelete(parseInt(args[0]) + 1, true).then(deleted => {

        let botmessage = msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Nachrichten Erfolgreich gelöscht")
            .setDescription("Es wurden erfolgreich `" + (deleted.size - 1) + "` Nachrichten gelöscht!")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag)
            .setColor("GREEN")).then(m => m.delete({timeout: 3000}));

    })

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "clear",
    description: "Löscht bis zu 100 Nachrichten, die nicht älter wie 14 Tage sind.",
    usage: "<int amount>",
    permission: "MANAGE_MESSAGES"

}