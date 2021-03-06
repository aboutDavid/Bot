const Discord = require('discord.js');
const client = new Discord.Client();
const Statcord = require("statcord.js");
require('dotenv').config()
const fetch = require('node-fetch');
let jsoning = require('jsoning');
let db = new jsoning("sql.json");

const statcord = new Statcord.Client({
    client,
    key: process.env.STAT,
    postCpuStatistics: true, /* Whether to post memory statistics or not, defaults to true */
    postMemStatistics: true, /* Whether to post memory statistics or not, defaults to true */
    postNetworkStatistics: true, /* Whether to post memory statistics or not, defaults to true */
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  statcord.autopost();
});

client.on('message', msg => {

  
  //if(msg.content.startsWith("!") !== true){
     //process.exit() 
  //}
  var content = "!help";
  if(msg.content.startsWith(content) !== false){
statcord.postCommand(content, msg.author.id);
    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help')
    .setURL('https://discord.riverside.rocks')
    .setDescription('Learn about how to use this fine bot.')
    .setThumbnail('https://images.fineartamerica.com/images-medium-large/international-biohazard-symbol-.jpg')
    .addField('!help', 'Shows this message', true)
    .addField('!lookup *id*', 'Returns the amount of times a user was found in our database.', true)
    .addField('!report *id*', 'Reports a user. Grab an API key from https://discord.riverside.rocks/login', true)
    .setTimestamp()  
    msg.reply(exampleEmbed);
	      fetch('https://discord.riverside.rocks/stats.json.php')
    .then(res => res.json())
    .then(json => {
        client.user.setPresence({ activity: { name: 'with '+json.reports+' reports' }, status: 'online' })
        .then(console.log)
         .catch(console.error);

    })
  }

  var content = "!invite";

  if(msg.content.startsWith(content) !== false){
    // returns the URL of the invite link
    // Fill this in with the 
    var YOUR_CLIENT_ID = "764485265775263784";
    msg.reply("Invite our bot here: https://discord.com/oauth2/authorize?client_id="+YOUR_CLIENT_ID+"&scope=bot&permissions=3072");
	      fetch('https://discord.riverside.rocks/stats.json.php')
    .then(res => res.json())
    .then(json => {
        client.user.setPresence({ activity: { name: 'with '+json.reports+' reports' }, status: 'online' })
        .then(console.log)
         .catch(console.error);

    })
  }

  var content = "!lookup";
  if(msg.content.startsWith(content) !== false){
statcord.postCommand(content, msg.author.id);
      var id = msg.content.substr(8);
      console.log(id+" was requested.")
      fetch('https://discord.riverside.rocks/check.json.php?id='+id)
    .then(res => res.json())
    .then(json => {

    
        if(json.reports !== ""){
		    fetch('https://discord.riverside.rocks/stats.json.php')
    .then(res => res.json())
    .then(json => {
        client.user.setPresence({ activity: { name: 'with '+json.reports+' reports' }, status: 'online' })
        .then(console.log)
         .catch(console.error);

    })
            if(typeof json.reports == 'undefined'){
                msg.reply("Invalid user.")
            }else{
                msg.reply(`User requested has **${json.reports}** reports and has an abuse score of **${json.score}**. See more about ths user at https://discord.riverside.rocks/check?id=${id} . If you feel that this user is abusive, please report them at https://discord.riverside.rocks/report?id=${id} .`)
            }
        }else{
            msg.reply("Invalid user.")
        }
    })

  }
  var rep = "!report";
  if(msg.content.startsWith(rep) !== false){
statcord.postCommand(rep, msg.author.id);
    var id = msg.content.substr(8);
      var uid = msg.author.id;
	let isnum = /^\d+$/.test(uid);
	if(isnum == false){
		msg.reply("Discord IDs can only contain numbers.")
	}else{
      fetch('https://discord.riverside.rocks/keys.json.php?key='+process.env.ADMIN+'&id='+uid)
    .then(res => res.json())
    .then(json => {
      var user_key = json.key;
      console.log('https://discord.riverside.rocks/report.json.php?key='+user_key+'&id='+id+'&details=Reported via Discord Client');
      fetch('https://discord.riverside.rocks/report.json.php?key='+user_key+'&id='+id+'&details=Reported via Discord Client')
    .then(res => res.json())
    .then(json => {
      if(json.message == "Success"){
        msg.reply("Reported user "+id+". (Using default reason: `Reported via Discord Client`)")
      }else{
        msg.reply("Sorry, something went wrong: "+json.message+" Please note that you get get an API Key at https://discord.riverside.rocks/login")

      }
    })
    })
	}
    }
  });

client.login(process.env.TOKEN);
