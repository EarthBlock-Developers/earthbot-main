//INIT LIBRARIES
const Discord = require('discord.js');
const Pterodactyl = require("nodeactyl-beta");
const mc_server = new Pterodactyl.NodeactylClient("http://45.88.110.213:8089", "BwELET7P7BbEdwnB0O1K8fNUFAmvOacZMvY4CUITWpMnrTwZ")

//CODE THAT RUNS ON EVERY USAGE
module.exports.run = async (msg, args, bot) => {

    //CHECK PERMS AND ARGS
    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.delete();
    if(!args[0]) return msg.delete();

    //MANAGE SERVER
    switch (args[0]) {

        case "start":
            await mc_server.startServer("a89ccb98");
            await msg.react("✅");
            break;

        case "stop":
            await mc_server.stopServer("a89ccb98");
            await msg.react("✅");
            break;

        case "restart":
            await mc_server.restartServer("a89ccb98");
            await msg.react("✅");
            break;

        case "kill":
            await mc_server.killServer("a89ccb98");
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
    permission: "ADMINISTRATOR"

}