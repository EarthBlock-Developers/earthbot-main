//INIT LIBRARIES
const Discord = require('discord.js');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    let user = msg.mentions.members.first();

    //CHECK IF ARGS[0] IS MENTION
    if (!user) {
        user = msg.member;
    }

    //BUILD INFO EMBED
    const embed = new Discord.MessageEmbed()
        .setTitle("User-Info von " + user.user.username)
        .setTimestamp(new Date())
        .setThumbnail(user.user.avatarURL());

    embed.addField("Tag", user.user.tag, true);
    embed.addField("ID", user.id, true)
    embed.addField("Bot", user.bot ? "Ja" : "Nein", true);
    embed.addField("Discord beigetreten", `${user.user.createdAt.getDay()}.${user.user.createdAt.getMonth()}.${user.user.createdAt.getFullYear()}`, true);
    embed.addField("Server beigetreten", `${user.joinedAt.getDay()}.${user.joinedAt.getMonth()}.${user.joinedAt.getFullYear()}`, true);
    embed.addField("Boosted Server", user.premiumSince ? "Ja" : "Nein", true);

    let roles = user.roles.cache;
    let rolesArr = [];

    roles.each(role => {
        if(role.name === "@everyone") {} else rolesArr.push("<@&" + role.id + ">");
    })

    embed.addField("Rollen", rolesArr.join(" "));

    msg.channel.send(embed);
}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "info",
    description: "Zeigt verschiedene Informationen zu einem User",
    usage: "<Mention user>",
    permission: "keine"

}