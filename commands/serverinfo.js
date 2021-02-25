//INIT LIBRARIES
const Discord = require('discord.js');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //BUILD INFO EMBED
    const embed = new Discord.MessageEmbed()
        .setTitle("Server-Info von " + msg.guild.name)
        .setTimestamp(new Date())
        .setThumbnail(msg.guild.iconURL());

    embed.addField("ID", msg.guild.id);
    embed.addField("Server erstellt", `${msg.guild.createdAt.getDay()}.${msg.guild.createdAt.getMonth()}.${msg.guild.createdAt.getFullYear()}`, true);
    embed.addField("User", msg.guild.memberCount, true);
    embed.addField("Channels und Kategorien", msg.guild.channels.cache.size, true)
    embed.addField("Serverboosting", msg.guild.premiumSubscriptionCount ? "Level: " + msg.guild.premiumSubscriptionCount : "Nein", true);

    msg.channel.send(embed);
}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "serverinfo",
    description: "Zeigt verschiedene Informationen zum Server an",
    usage: "",
    permission: "keine"

}