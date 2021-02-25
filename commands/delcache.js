//INIT LIBRARIES
const Discord = require('discord.js');
const fs = require("fs");

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

    console.log("[/delcache] Deleting cache for command files...")

    //READ COMMAND DIR
    let dir = fs.readdirSync("./commands/");

    //DEL CACHE FOR EACH COMMAND FILE
    dir.forEach(file => {

        if(file.split(".")[1] === "js") {

            console.log("[/delcache] Deleting cache for " + file);
            delete require.cache[require.resolve('./' + file)];

        }

    })

    console.log("[/delcache] Deleting cache successful!")
    msg.react("✅");

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "delcache",
    description: "Löscht den Bot Cache!",
    usage: "",
    permission: "ADMINISTRATOR"

}