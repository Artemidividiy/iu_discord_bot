const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const WolframAlphaAPI = require("wolfram-alpha-api");
const waApi = WolframAlphaAPI(process.env.WATOKEN);
const child_process = require("child_process");

function log(data) {
  console.log(
    "[" +
      new Date(Date.now()).toLocaleDateString() +
      " " +
      new Date(Date.now()).toLocaleTimeString() +
      "] (bot) >" +
      data +
      "\n"
  );
}

client.on("ready", () => {
  log(`initialized as ${client.user.tag}`), schedule("19:47", Gubar); // вкл Губарь
  schedule("21:17", Gubar_off); // откл Губарь
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("bonk!");
    log(
      `${client.user.username} sent bonk! to ${msg.content} by ${msg.author.username}`
    );
  }
  if (msg.channel.name === "получение-ролей") {
    let r1 = msg.guild.roles.cache.find((r) => r.name === "1 группа");
    let r2 = msg.guild.roles.cache.find((r) => r.name === "2 группа");
    let r3 = msg.guild.roles.cache.find((r) => r.name === "3 группа");
    let r4 = msg.guild.roles.cache.find((r) => r.name === "4 группа");
    let r5 = msg.guild.roles.cache.find((r) => r.name === "5 группа");
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
    log(`${msg.author.username}'s chosen ${msg.content}`);
    log(msg.content);
  }

  if (msg.content.split(" ")[0] === "dice") {
    const result = dice(msg.content.split(" ")[1]);
    const embed = new Discord.MessageEmbed();
    msg.reply(
      embed
        .setAuthor(client.user.username)
        .setColor(0xffffff)
        .setTitle("Dice roll")
        .setDescription(`the result is: ${result}`)
    );
    log(`success. we have ${result} on a dice`);
  }

  if (msg.content.split(" ")[0] === "calc") {
    calculate(msg, client);
  }

  if (msg.content.split(" ")[0] === "fc") {
    let nfiles = fs.readdirSync("../in/").length;
    child_process.execSync(
      "curl " + msg.attachments.array()[0].url + " -o ../in/" + nfiles + ".pas"
    );
    console.log(
      "curl " + msg.attachments.array()[0].url + " -o ../in/" + nfiles + ".pas"
    );
    let nout = fs.readdirSync("../out/").length;
    child_process.execSync(
      "cd ../autoflowchart && node main.js ../in/" +
        nfiles +
        ".pas ../out/" +
        nout +
        ".png"
    );
    const embed = new Discord.MessageEmbed();
    console.log("http://95.165.106.101:8080/" + nout + ".png");
    msg.reply(embed.setImage("http://95.165.106.101:8080/" + nout + ".png"));
  }
});

client.on("guildMemberAdd", (member) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("welcome")
    .setDescription(description())
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

client.login(process.env.BOT_TOKEN);

function description() {
  return 'тебе необходимо "зарегистрироваться" \n подробнее: канал "получение-ролей"';
}

function dice(n = 6) {
  return Math.floor(Math.random() * n) + 1;
}

function calculate(msg, client) {
  let data = msg.content;
  console.log(data);
  let a = data.split(" ");
  console.log(a);
  let string = "";
  for (let index = 1; index < a.length; index++) {
    string += a[index] + " ";
  }
  let expr = string.slice(0, string.length - 1);
  waApi.getFull(expr).then(
    function (result) {
      let embed = new Discord.MessageEmbed();
      if (result.pods) {
        let rootArray = result.pods.filter((pod) => {
          return (
            pod.title === "Root" ||
            pod.title === "Roots" ||
            pod.title === "Solution" ||
            pod.title === "Solutions"
          );
        })[0];
        if (rootArray) {
          let rootNum = 1;
          rootArray.subpods.forEach((root) => {
            embed.setImage(root.img.src).setDescription(rootNum + "-й корень");
            msg.reply(embed);
            rootNum++;
          });
        }
        let resObj = result.pods.filter((pod) => {
          return pod.title === "Result";
        })[0];
        if (resObj) {
          let resURL = resObj.subpods[0].img.src;
          embed.setImage(resURL).setDescription("Приведение");
          msg.reply(embed);
        }
        let plotObj = result.pods.filter((pod) => {
          return (
            pod.title === "Plot" ||
            pod.title === "Plots" ||
            pod.title === "Implicit plot" ||
            pod.title === "Implicit plots" ||
            pod.title === "Root plot" ||
            pod.title === "Root plots"
          );
        })[0];
        if (plotObj) {
          let plotURL = plotObj.subpods[0].img.src;
          embed.setImage(plotURL).setDescription("График");
          msg.reply(embed);
        }
        let limObj = result.pods.filter((pod) => {
          return pod.title === "Limit";
        })[0];
        if (limObj) {
          console.log(limObj.plaintext);
          if (
            limObj.subpods[0].plaintext === "(two-sided limit does not exist)"
          ) {
            msg.reply("Двусторонний предел не существует");
          } else {
            let limURL = limObj.subpods[0].img.src;
            embed.setImage(limURL).setDescription("Двусторонний предел");
            msg.reply(embed);
          }
        }
        let llimObj = result.pods.filter((pod) => {
          return pod.title === "Limit from the left";
        })[0];
        if (llimObj) {
          let llimURL = llimObj.subpods[0].img.src;
          embed.setImage(llimURL).setDescription("Левосторонний предел");
          msg.reply(embed);
        }
        let rlimObj = result.pods.filter((pod) => {
          return pod.title === "Limit from the right";
        })[0];
        if (rlimObj) {
          let rlimURL = rlimObj.subpods[0].img.src;
          embed.setImage(rlimURL).setDescription("Правосторонний предел");
          msg.reply(embed);
        }
        let dvtObj = result.pods.filter((pod) => {
          return pod.title === "Derivative";
        })[0];
        if (dvtObj) {
          let dvtURL = dvtObj.subpods[0].img.src;
          embed.setImage(dvtURL).setDescription("Производная");
          msg.reply(embed);
        }
        let indObj = result.pods.filter((pod) => {
          return pod.title === "Indefinite integral";
        })[0];
        if (indObj) {
          let indURL = indObj.subpods[0].img.src;
          embed.setImage(indURL).setDescription("Неопределенный интеграл");
          msg.reply(embed);
        }
        let defObj = result.pods.filter((pod) => {
          return pod.title === "Definite integral";
        })[0];
        if (defObj) {
          let defURL = defObj.subpods[0].img.src;
          embed.setImage(defURL).setDescription("Определенный интеграл");
          msg.reply(embed);
        }
        let ttObj = result.pods.filter((pod) => {
          return pod.title === "Truth table";
        })[0];
        if (ttObj) {
          let ttURL = ttObj.subpods[0].img.src;
          embed.setImage(ttURL).setDescription("Таблица истинности");
          msg.reply(embed);
        }
        let eqObj = result.pods.filter((pod) => {
          return pod.title === "Equation";
        })[0];
        if (eqObj) {
          let eqURL = eqObj.subpods[0].img.src;
          embed.setImage(eqURL).setDescription("Уравнение");
          msg.reply(embed);
        }
        let schObj = result.pods.filter((pod) => {
          return pod.title === "Schematic" || pod.title === "Schematics";
        })[0];
        if (schObj) {
          let schURL = schObj.subpods[0].img.src;
          embed.setImage(schURL).setDescription("Схема");
          msg.reply(embed);
        }
      } else {
        msg.reply("Превышено время вычисления");
      }
    },
    function (err) {
      msg.reply("Что-то пошло по пизде, попробуйте еще раз");
      log(err);
    }
  );
}

function generate_physdiary(msg) {
  app.get("/physdiary", (req, res) => {
    var dts;
    var args = msg.content.split(" ");
    const python = spawn("python", ["__main__.py"]);
    python.stdin.write(args[0]);
    python.stdin.write(args[1]);
    python.stdin.write(args[2]);
    python.stdin.write(args[3]);
    python.stdin.write(args[4]);
    python.stdin.write(args[5]);
    python.stdin.write(args[6]);
    python.stdin.write(args[7]);
    python.stdin.write(args[8]);
    // for (let i = 0; i < 9; i++) {python.stdin.write(args[i]);}
    python.stdout.on("data", (data) => {
      console.log("we got the result");
      dts = data;
    });
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
  });
  res.send(dts);
}
