//INIT LIBRARIES
const Discord = require('discord.js');

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

    //CHECK CHANNEL ARG
    let channel = msg.mentions.channels.first();
    if(!channel) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Der angegebene Parameter `" + args[0] + "` ist kein Channel (#channelname)! Bitte überprüfe die Eingabe!\nUsage: `" + bot.PREFIX + this.help.name + " " + this.help.usage + "`")
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //CHECK QUESTION
    if(!args[1]) {

        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Bitte hänge eine Frage an!\nUsage: " + bot.PREFIX + this.help.name + " " + this.help.usage)
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //BUILD EMBED FOR SURVEY AND SEND
    var embed = new Discord.MessageEmbed()
        .setTitle("Umfrage!")
        .setColor("#" + Math.floor(Math.random()*16777215).toString(16))
        .setDescription(args.slice(1).join(" "))
        .setAuthor(msg.author.username, msg.author.avatarURL());

    //TRY SEND MESSAGE AND REACT TO IT
    let message;
    try {
        message = channel.send(embed);
        await (await message).react("👍");
        await (await message).react("👎");
    } catch {
        try {
            message.delete();
        } catch {

        } finally {
            await msg.channel.send(new Discord.MessageEmbed()
                .setTitle("Hier ist etwas schief gelaufen!")
                .setColor("RED")
                .setDescription("Offenbar fehlen mir Berechtigungen um im Channel `" + channel.name + "` eine Umfrage erstellen zu können, oder ein unbekannter Fehler ist aufgetreten:\n`SEND_MESSAGES, ADD_REACTIONS`")
                .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));
        }

        return undefined;

    }

    //ADD REACTION TO MSG
    await msg.react("✅");

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "umfrage",
    description: "Erstellt eine Umfrage in einem Channel!",
    usage: "<TextChannel channel> <String question>",
    permission: "PRIORITY_SPEAKER"

}