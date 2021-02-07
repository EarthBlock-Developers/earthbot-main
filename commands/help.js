//INIT LIBRARIES
const Discord = require('discord.js');
const fs = require('fs');

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //READ COMMAND DIR
    let dir = fs.readdirSync("./commands/");

    //ADD ALL .JS FILES TO AN ARRAY
    let commandArray = [];

    dir.forEach(file => {

        if(file.split(".")[1] === "js") {

            const props = {

                name: require("./" + file).help.name,
                description: require("./" + file).help.description,
                usage: require("./" + file).help.usage,
                permission: require("./" + file).help.permission

            }

            delete require.cache[require.resolve('./' + file)];

            commandArray.push(props);

        }

    })

    //CONSTRUCT HELP EMBED
    let helpEmbed = new Discord.MessageEmbed()
        .setTitle("Übersicht der Befehle von " + bot.user.tag)
        .setThumbnail(bot.user.avatarURL())
        .setFooter("Befehl ausgeführt durch: " + msg.author.tag);

    //CREATE RECURSIVE FIELDS FOR HELP EMBED
    commandArray.forEach(props => {

        helpEmbed.addField(`${bot.PREFIX}${props.name} ${props.usage}`, `${props.description}\nPermission: \`${props.permission}\``);

    })

    //SEND HELP EMBED
    msg.channel.send(helpEmbed);

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "help",
    description: "Gibt dir eine Übersicht über alle Befehle",
    usage: "",
    permission: "keine"

}