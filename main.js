//INIT LIBRARIES
const Discord = require('discord.js');
const fs = require('fs');

//INIT VARIABLES
const bot = new Discord.Client();
const PREFIX = require('./settings').variables.PREFIX;
const TOKEN = require('./settings').variables.TOKEN;
const DATE = new Date();
let service = require('./settings').variables.SERVICE;

//SAVE IMPORTANT VARIABLES TO CLIENT
bot.PREFIX = PREFIX;

//START ROUTINE
bot.on("ready", () => {

    console.log(`[/start] [${DATE.getHours()}:${DATE.getMinutes()}] Logged in successful to ` + bot.user.tag);
    bot.user.setPresence({ status: "online", activity: { name: "auf EarthBlock Network", type: "PLAYING" } }).then(() => { return true });

    //CACHE REACTION ROLE MESSAGE FROM #RULES
    bot.guilds.cache.get("740571881014558790").channels.cache.get("740572760782143573").messages.fetch("807923274729127957");

});

// EVENT LISTENERS //

//MESSAGE LISTENER
bot.on("message", message => {

    let messageArray = message.content.split(" ").slice(1);
    let cmd = message.content.split(" ")[0].replace(PREFIX, "").toLowerCase();

    let log = `[/cmd] [${DATE.getHours()}:${DATE.getMinutes()}] The user ${message.author.tag} tried to use ${cmd}: `;

    if(message.author.bot) return undefined;
    if(message.channel.type === "dm") return undefined;
    if(message.channel.id === "740571881014558793") return undefined;
    if(!message.content.startsWith(PREFIX)) return undefined;

    if(cmd === "service") {

        //if(!message.member.roles.cache.has("807670780644032552")) return;
        if(messageArray[0] === "on") serviceOn();
        if(messageArray[0] === "off") serviceOff();
        return true;

    }

    if(service) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Wartungsarbeiten!")
            .setDescription("Aufgrund von Wartungsarbeiten ist der Bot temporär nicht verfügbar und ist auf wenige Features beschrängt!")
            .setColor("RED");
        message.channel.send(embed);
        return;
    }

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

    if (reaction.message.id === "807923274729127957" && reaction.emoji.name === "✅") {

        let member = reaction.message.guild.members.cache.get(user.id);
        member.roles.add("807672663819943937");
        reaction.users.remove(user.id);

    }

})

function serviceOn() {

    service = true;
    const SETTINGS = require("./settings");
    let json = {

        TOKEN: "" + SETTINGS.variables.TOKEN,
        PREFIX: "" + SETTINGS.variables.PREFIX,
        SERVICE: service

    }

    fs.writeFileSync("settings.js", "module.exports.variables = " + JSON.stringify(json, null, 2).toString());

    bot.user.setPresence({status: "idle", activity: {name: "WARTUNGSARBEITEN!", type: "PLAYING"}}).then(() => { return true });
}

function serviceOff() {

    service = false;
    const SETTINGS = require("./settings");
    let json = {

        TOKEN: "" + SETTINGS.variables.TOKEN,
        PREFIX: "" + SETTINGS.variables.PREFIX,
        SERVICE: service

    }

    fs.writeFileSync("settings.js", "module.exports.variables = " + JSON.stringify(json, null, 2).toString());

    bot.user.setPresence({ status: "online", activity: { name: "auf EarthBlock Network", type: "PLAYING" } }).then(() => { return true });
}

//BOT LOGIN
bot.login(TOKEN);