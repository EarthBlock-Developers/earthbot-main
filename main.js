//INIT LIBRARIES
const Discord = require('discord.js');
const fs = require('fs');

//INIT VARIABLES
const bot = new Discord.Client();
const PREFIX = require('./settings').variables.PREFIX;
const TOKEN = require('./settings').variables.TOKEN;
const DATE = new Date();

let reactionRoleRule = undefined;

//SAVE IMPORTANT VARIABLES TO CLIENT
bot.PREFIX = PREFIX;

//START ROUTINE
bot.on("ready", () => {

    console.log(`[/start] [${DATE.getHours()}:${DATE.getMinutes()}] Logged in successful to ` + bot.user.tag);
    bot.user.setPresence({ status: "online", activity: { name: "auf EarthBlock Network", type: "PLAYING" } }).then(() => { return true });

    reactionRoleRule = bot.guilds.cache.get("740571881014558790").channels.cache.get("740572760782143573").messages.fetch("807923274729127957");

});

// EVENT LISTENERS //

//MESSAGE LISTENER
bot.on("message", message => {

    let messageArray = message.content.split(" ").slice(1);
    let cmd = message.content.split(" ")[0].replace(PREFIX, "").toLowerCase();

    let log = `[/cmd] [${DATE.getHours()}:${DATE.getMinutes()}] The user ${message.author.tag} tried to use ${cmd}: `;

    if(message.author.bot) return undefined;
    if(message.channel.type === "dm") return undefined;

    try {

        let cmdfile = require("./commands/" + cmd);
        cmdfile.run(message, messageArray, bot).then(() => {

            delete require.cache[require.resolve('./commands/' + cmd)];

        });
        log = log + "success";

    } catch (error) {

        log = log + "error";
        let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Hier ist etwas schiefgelaufen...")
            .setDescription(`Der eingegebene Befehl \`${cmd}\` konnte nicht gefunden werden!\n Vielleicht hilft dir \`${PREFIX}help\` weiter?`);
        message.channel.send(embed);

    } finally {

        console.log(log);

    }

})

//REACTION ROLE FOR #RULES
bot.on("messageReactionAdd", (reaction, user) => {

    if (reaction.message.id === "807923274729127957" && reaction.emoji.name === "white_check_mark") {

        let member = guild.members.cache.get(user.id);
        member.roles.add("807672663819943937");
        reaction.users.remove(user.id);

    }



})

//BOT LOGIN
bot.login(TOKEN);