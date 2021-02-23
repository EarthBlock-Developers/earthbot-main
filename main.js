//INIT LIBRARIES
const Discord = require('discord.js');
const fs = require('fs');
const Pterodactyl = require('nodeactyl-beta');

//INIT VARIABLES
const bot = new Discord.Client();
const PREFIX = require('./settings').variables.PREFIX;
const TOKEN = require('./settings').variables.TOKEN.DISCORD;
const DATE = new Date();
let service = require('./settings').variables.SERVICE;
const mc_server = new Pterodactyl.NodeactylClient("http://45.88.110.213:8089", require('./settings').variables.TOKEN.PTERODACTYL);

//SAVE IMPORTANT VARIABLES TO CLIENT
bot.PREFIX = PREFIX;

//START ROUTINE
bot.on("ready", () => {

    console.log(`[/start] [${DATE.getHours()}:${DATE.getMinutes()}] Logged in successful to ` + bot.user.tag);

    //SET STATUS => SERVICE
    if(service) bot.user.setPresence({status: "idle", activity: {name: "WARTUNGSARBEITEN!", type: "PLAYING"}}).then(() => { return true });
    else bot.user.setPresence({ status: "online", activity: { name: "auf EarthBlock Network", type: "PLAYING" } }).then(() => { return true });

    //CACHE REACTION ROLE MESSAGE FROM #RULES
    bot.guilds.cache.get("740571881014558790").channels.cache.get("740572760782143573").messages.fetch("807923274729127957");

    //START MINECRAFT STATS LOOP
    minecraft_stats();

});

// EVENT LISTENERS //

//MESSAGE LISTENER
bot.on("message", message => {

    let messageArray = message.content.split(" ").slice(1);
    let cmd = message.content.split(" ")[0].replace(PREFIX, "").toLowerCase();

    let log = `[/cmd] [${DATE.getHours()}:${DATE.getMinutes()}] The user ${message.author.tag} tried to use ${cmd}: `;

    if(message.author.bot) return undefined;
    if(message.channel.type === "dm") return undefined;
    if(!message.content.startsWith(PREFIX)) return undefined;

    if(cmd === "service") {

        //if(!message.member.roles.cache.has("807670780644032552")) return;
        if(messageArray[0] === "on") serviceOn(message);
        if(messageArray[0] === "off") serviceOff(message);
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

function serviceOn(message) {

    service = true;
    const SETTINGS = require("./settings");
    let json = {

        TOKEN: {
            DISCORD: "" + SETTINGS.variables.TOKEN.DISCORD,
            PTERODACTYL: "" + SETTINGS.variables.TOKEN.PTERODACTYL
        },
        PREFIX: "" + SETTINGS.variables.PREFIX,
        SERVICE: service

    }

    fs.writeFileSync("settings.js", "module.exports.variables = " + JSON.stringify(json, null, 2).toString());

    message.delete();
    bot.user.setPresence({status: "idle", activity: {name: "WARTUNGSARBEITEN!", type: "PLAYING"}}).then(() => { return true });
}

function serviceOff(message) {

    service = false;
    const SETTINGS = require("./settings");
    let json = {

        TOKEN: {
            DISCORD: "" + SETTINGS.variables.TOKEN.DISCORD,
            PTERODACTYL: "" + SETTINGS.variables.TOKEN.PTERODACTYL
        },
        PREFIX: "" + SETTINGS.variables.PREFIX,
        SERVICE: service

    }

    fs.writeFileSync("settings.js", "module.exports.variables = " + JSON.stringify(json, null, 2).toString());

    message.delete();
    bot.user.setPresence({ status: "online", activity: { name: "auf EarthBlock Network", type: "PLAYING" } }).then(() => { return true });
}

//JOIN EVENT -> MESSAGE AND UPDATE STAT CHANNEL
bot.on("guildMemberAdd", member => {

    //RETURNS WHEN IT IS NOT THE OFFICIAL SERVER
    if(member.guild.id !== "740571881014558790") return;

    //BUILD EMBED FOR WELCOME CHANNEL AND SEND
    let embed = new Discord.MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL(), member.user.displayAvatarURL())
        .setDescription("hat den Server betreten!")
        .setColor("GREEN")
        .setFooter("Usercount: " + member.guild.memberCount);

    member.guild.systemChannel.send(embed);

    //UPDATE SERVER STATS
    member.guild.channels.cache.get("813339425882898432").setName("Members: " + member.guild.memberCount);

})

//QUIT EVENT -> MESSAGE AND UPDATE STAT CHANNEL
bot.on("guildMemberRemove", member => {

    //RETURNS WHEN IT IS NOT THE OFFICIAL SERVER
    if(member.guild.id !== "740571881014558790") return;

    //BUILD EMBED FOR WELCOME CHANNEL AND SEND
    let embed = new Discord.MessageEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setDescription("hat den Server verlassen!")
        .setColor("RED")
        .setFooter("Usercount: " + member.guild.memberCount);

    member.guild.systemChannel.send(embed);

    //UPDATE SERVER STATS
    member.guild.channels.cache.get("813339425882898432").setName("Members: " + member.guild.memberCount);

})

// SERVER STATS //

//MINECRAFT SERVER STATS
function minecraft_stats() {

    updateChannel();

    setInterval(() => {

        updateChannel();

    }, 300000)

    async function updateChannel() {

        let guild = bot.guilds.cache.get("740571881014558790");
        let channels = guild.channels.cache;
        let channel_name = channels.get("813348361381085195");
        let channel_status = channels.get("813348406726098984");
        let channel_cpu = channels.get("813348433922359357");
        let channel_ram = channels.get("813348457745219584");

        //VARIABLES FROM PTERODACTYL -> NORMAL STATES WHEN NO ANSWER FROM PTERODACTYL
        let cpu = 1;
        let maxRam = 1;
        let nowRam = 1;
        let status = "no_connection";
        let name = "no_connection";

        //LOGIN TO GET SERVER INFO
        await mc_server.getServerUsages("a89ccb98").then(result => {

            cpu = result.resources.cpu_absolute;
            nowRam = (result.resources.memory_bytes / (1024*1024)).toFixed(0);
            status = result.current_state;

        });

        await mc_server.getServerDetails("a89ccb98").then(result => {

            maxRam = result.limits.memory;
            name = result.name;

        })

        let ram = Math.round(((nowRam / maxRam) * 100 + Number.EPSILON) * 100) / 100;
        cpu = Math.round((cpu + Number.EPSILON) * 100) / 100;

        await channel_name.setName(name);
        await channel_status.setName(status);
        await channel_cpu.setName("CPU: " + cpu + "%");
        await channel_ram.setName("RAM: " + ram + "%");

    }

}


//BOT LOGIN
bot.login(TOKEN);