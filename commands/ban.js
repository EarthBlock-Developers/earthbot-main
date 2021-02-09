//INIT LIBRARIES
const Discord = require('discord.js');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMISSION
    if (!msg.member.permissions.has("BAN_MEMBERS")) {

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
            .setDescription("Der angegebene Parameter ` ` ist keine Zahl! Bitte überprüfe die Eingabe!\nUsage: " + bot.PREFIX + this.help.name + " " + this.help.usage)
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //CHECK IF ARGS[0] IS MENTION
    if (!msg.mentions.members.first()) {
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Hier ist etwas schief gelaufen!")
            .setColor("RED")
            .setDescription("Der angegebene Parameter `" + args[0] + "` ist keine Mention! Bitte überprüfe die Eingabe!\nUsage: " + bot.PREFIX + this.help.name + " " + this.help.usage)
            .setFooter(msg.content.split(" ")[0] + " | Befehl ausgeführt durch " + msg.author.tag));

    }

    //BUILD EMBED FOR USER
    let embed = new Discord.MessageEmbed()
        .setTitle("Du wurdest gebannt!")
        .setColor("RED")
        .setThumbnail(msg.guild.iconURL())
        .setFooter("©2021 EarthBlock Network")
        .addField("Server", msg.guild.name)
        .addField("Gebannt durch", msg.author.tag)

    if(args.slice(1).join(" ")) {
        embed.addField("Grund", args.slice(1).join(" "));
    } else {
        embed.addField("Grund", "Kein Grund angegeben");
    }

    embed.addField("Datum", new Date().getDate() + "." + new Date().getMonth() + "." + new Date().getFullYear() + " " + new Date().getHours() + ":" + new Date().getMinutes());

    //SEND EMBED TO USER AND KICK HIM
    let member = msg.mentions.members.first();

    await member.send(embed);
    await member.ban({ reason: args.slice(1).join(" ") });

    //SEND EMBED TO SERVER
    await msg.channel.send(embed);
}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "ban",
    description: "Bannt einen Nutzer vom Server",
    usage: "<mention user> <string reason>",
    permission: "BAN_MEMBERS"

}