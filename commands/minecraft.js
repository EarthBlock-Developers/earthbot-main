//INIT LIBRARIES
const Discord = require('discord.js');
const Pterodactyl = require("nodeactyl-beta");
const SETTINGS = require("../settings");
const mc_server = new Pterodactyl.NodeactylClient("http://ptero.galaxycrow.de/", SETTINGS.variables.TOKEN.PTERODACTYL);

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMS AND ARGS
    if(!msg.member.permissions.has("PRIORITY_SPEAKER")) return msg.delete();
    if(!args[0]) return msg.delete();

    //MANAGE SERVER
    switch (args[0]) {

        case "start":
            await mc_server.startServer(SETTINGS.variables.SERVER_ID);
            await msg.react("✅");
            break;

        case "stop":
            await mc_server.stopServer(SETTINGS.variables.SERVER_ID);
            await msg.react("✅");
            break;

        case "restart":
            await mc_server.restartServer(SETTINGS.variables.SERVER_ID);
            await msg.react("✅");
            break;

        case "kill":
            await mc_server.killServer(SETTINGS.variables.SERVER_ID);
            await msg.react("✅");
            break;

        default:
            await msg.react("❌");
            break;

    }

}

//PROPERTIES FOR /HELP
module.exports.help = {

    name: "minecraft",
    description: "Steuert den Minecraft Server",
    usage: "<start | stop | restart | kill>",
    permission: "PRIORITY_SPEAKER"

}