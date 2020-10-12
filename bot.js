const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const waApi = "56389J-H997PXPK83";
//токен для работы вольфрама на хероку
// const waApi = WolframAlpha(process.env.WATOKEN);
client.on("ready", () => {
//   fappend(`${client.user.tag} initiated at ${client.guilds}`);
  console.log("bot is ready");
  console.log(`initialized as ${client.user.tag}`);
  schedule("16:47", Gubar); // вкл Губарь
  schedule("18:17", Gubar_off); // откл Губарь
});

client.on("message", (msg) => {
//   fappend(`[${msg.author}] : ${msg.content}`);
  if (msg.content === "ping") msg.reply("bonk!");
  let r1 = msg.guild.roles.cache.find((r) => r.name === "1 группа");
  let r2 = msg.guild.roles.cache.find((r) => r.name === "2 группа");
  let r3 = msg.guild.roles.cache.find((r) => r.name === "3 группа");
  let r4 = msg.guild.roles.cache.find((r) => r.name === "4 группа");
  let r5 = msg.guild.roles.cache.find((r) => r.name === "5 группа");
  if (msg.channel.name === "получение-ролей") {
    if (msg.content === "1") {
      msg.member.roles.add(r1).catch(console.error);
      msg.delete();
    }
    if (msg.content === "2") {
      msg.member.roles.add(r2).catch(console.error);
      msg.delete();
    }
    if (msg.content === "3") {
      msg.member.roles.add(r3).catch(console.error);
      msg.delete();
    }
    if (msg.content === "4") {
      msg.member.roles.add(r4).catch(console.error);
      msg.delete();
    }
    if (msg.content === "5") {
      msg.member.roles.add(r5).catch(console.error);
      msg.delete();
    }
    console.log(`${msg.author}'s chosen ${msg.content}`);
    console.log(msg.content);
  }

  if (msg.content.split(" ")[0] === "dice") {
    console.log("dice command");
    const embed = new Discord.MessageEmbed();
    msg.reply(
      embed
        .setAuthor(client.user.username)
        .setColor(0xffff)
        .setTitle("Dice roll")
        .setDescription(`the result is: ${dice(msg.content.split(" ")[1])}`)
    ); 
  } 
  if (msg.content.split(" ")[0] === "calculate") {
        msg.reply(calculate(msg.content, client));
    }
});

function show(arr) {
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

client.on("guildMemberAdd", (member) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("welcome")
    .setDiscription(discription())
    .setColor(0xae2c4c);
  const dmMessage = member.send(embed);
});

function schedule(time, trigger) {
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);
  const startTime = new Date();
  startTime.setHours(hour, minute);
  const now = new Date();
  if (startTime.getTime() < now.getTime()) {
    startTime.setHours(startTime.getHours() + 24);
  }
  const firstTriggerAfterMs = startTime.getTime() - now.getTime();
  setTimeout(function () {
    trigger();
    setInterval(trigger, 24 * 60 * 60 * 1000);
  }, firstTriggerAfterMs);
}

function Gubar() {
  client.guilds.cache.forEach((guild, snflk) => {
    let current = guild.members.cache.array()[
      Math.floor(Math.random() * guild.members.cache.size)
    ];
    // оповещение
    for (let channel of guild.channels.cache.array()) {
      if (channel.type === "text") {
        channel.send(
          "[Губарь]> Молодой человек/девушка в белом, <@" +
            current +
            ">, для вас лекция окончена, вставайте и уходите нахуй из аудитории!\nВы сможете читать и писать сообщения через полтора часа."
        );
        break;
      }
    }
    // присвоить роль
    let role = guild.roles.cache
      .array()
      .find((role) => role.name === "Выгнанный с лекции");
    current.roles.add(role);
  });
}

function Gubar_off() {
  client.guilds.cache.forEach((guild, snflk) => {
    // удалить роль
    let role = guild.roles.cache
      .array()
      .find((role) => role.name === "Выгнанный с лекции");
    role.members.first().roles.remove(role);
  });
}
client.login("NTk0MTYxMTgxNDE4MDYxODQ0.XRYZuA.anTckzYlxHIK2Nb1J4Jk2aS0his");
// client.login(process.env.BOT_TOKEN);

function discription() {
  return 'тебе необходимо "зарегистрироваться" \n подробнее: канал "получение-ролей"';
}

function calculate(data, client){
    console.log(data);
    var a = data.split(" ");
    console.log(a);
    var string = "";
    for (let index = 0; index < a.length; index++) {
        string += a[index] + "+";
    }
    var string1 = string.slice(0, string.length - 1);
    console.log(string);
    const embed = new Discord.MessageEmbed();
    var url = `http://api.wolframalpha.com/v1/simple?appid=${waApi}i=${string1}%3F`;
    console.log(url);
    return embed.setImage(`http://api.wolframalpha.com/v1/simple?appid=${waApi}&i=${string1}%3F`).setAuthor(client.user.username + client.user.username);
}

function dice(n) {
  return Math.floor(Math.random() * n) + 1;
}
//TODO: эта херня работает через залупу блять я ненавижу ебаный js блять
// async function fappend(text) {
//   try {fs.appendFile("log.txt", text, () => {r
//     if (err) throw err;
//   });} catch (e) {console.log(e);}
//   console.log(`${text} saved successfully`);
// }
