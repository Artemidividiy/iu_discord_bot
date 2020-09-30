const Discord = require('discord.js')
const client = new Discord.Client();
// token = "NzU4MzUxNzgxMTE3NDI3NzIz.X2tsIg.qv3QgCJ0IhHkjW6Gl0rx32Se790"
client.on('ready', () => {
    console.log("bot is ready");
    console.log(`initialized as ${client.user.tag}`);
})

client.on('message', msg =>{
    if(msg.content === 'ping') msg.reply('bong!');

    //Добавление роли
    console.log(typeof(msg.content));
    // console.log(show(msg.guild.roles.cache.array()))
    let r1 = msg.guild.roles.cache.find(r => r.name === '1 группа');
    let r2 = msg.guild.roles.cache.find(r => r.name === '2 группа');
    let r3 = msg.guild.roles.cache.find(r => r.name === '3 группа');
    let r4 = msg.guild.roles.cache.find(r => r.name === '4 группа');
    let r5 = msg.guild.roles.cache.find(r => r.name === '5 группа');
    if(msg.channel.name === 'получение-ролей'){
        if(msg.content === "1"){
            msg.member.roles.add(r1).catch(console.error);
            msg.delete();
        }
        if(msg.content === "2"){
            msg.member.roles.add(r2).catch(console.error);
            msg.delete();
        }
        if(msg.content === "3"){
            msg.member.roles.add(r3).catch(console.error);
            msg.delete();
        }
        if(msg.content === "4"){
            msg.member.roles.add(r4).catch(console.error);
            msg.delete();
        }
        if(msg.content === "5"){
            msg.member.roles.add(r5).catch(console.error);
            msg.delete();
        }
        console.log(`${msg.author}'s chosen ${msg.content}`);
    }
})

function show(arr) {
        for(var i = 0; i < arr.length; i++) {
            console.log(arr[i]);
        }
}

client.on('guildMemberAdd', member =>{
    const embed = new Discord.MessageEmbed().setTitle('welcome').setDiscription(discription()).setColor(0xAE2C4C);
    const dmMessage = member.send(embed); 
});

client.login(process.env.BOT_TOKEN);

function discription() {
    return 'тебе необходимо "зарегистрироваться" \n подробнее: канал "получение-ролей"';
}