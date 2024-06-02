const express = require('express');
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const app = express();
const port = 3000;

// Express setup
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Discord bot setup
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES, // Presence Intent
    Intents.FLAGS.GUILD_MEMBERS, // Server Members Intent
    Intents.FLAGS.MESSAGE_CONTENT // Message Content Intent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.token);

const prefix = "$";

const replace = [
  { word: "متوفر", replace: "مت9فر" },
  { word: "سيرفر", replace: "سيRفر" },
  { word: "سيرفرات", replace: "سيRفرات" },
  { word: "فيزا", replace: "فيزا" },
  { word: "حساب ديسكورد", replace: "7ساب ديس-ورد" },
  { word: "بيع", replace: "بي3" },
  { word: "شوب", replace: "ش9ب" },
  { word: "ديسكورد", replace: "ديس_ورد" },
  { word: "تبادل", replace: "تبا1دل" },
  { word: "توكن", replace: "ت9كن" },
  { word: "بوست", replace: "ب9ست" },
  { word: "توكنات", replace: "ت9كنات" },
  { word: "بوستات", replace: "ب9ستات" },
  { word: "حساب", replace: "حس1ب" },
  { word: "حسابات", replace: "حس1ب1ت" },
  { word: "حسابي", replace: "حس1بي" },
  { word: "نتفيلكس", replace: "ن$$فيلكس" },
  { word: "اون", replace: "ا9ن" },
  { word: "متجر", replace: "متجr" },
  { word: "سعر", replace: "س3ر" },
  { word: "مطلوب", replace: "مطل9ب" },
  { word: "دولار", replace: "دولاr" },
  { word: "سيرفر", replace: "سيرفr" },
  { word: "روبوكس", replace: "ر9بوكس" },
  { word: "كريديت", replace: "كري|ت" },
  { word: "عضو", replace: "عض9" },
  { word: "شحن", replace: "ش7ن" },
  { word: "نيترو", replace: "نيتر9" }
];

client.on("messageCreate", async message => {
  if (message.content.startsWith(prefix + "Start")) {
    if (!message.member.permissions.has("ADMINISTRATOR")) return;

    const embed = new MessageEmbed()
      .setTitle("تشفير")
      .setDescription("**اذا كان لديك منشور وتبي تسوي له تشفير ف برجاء ضغط على زر وكتابة منشورك بشكل صحيح.**")
      .setThumbnail(message.guild.iconURL());

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SECONDARY")
          .setLabel("تشفير")
          .setCustomId('replace')
      );

    message.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "replace") {
    const modal = new Modal()
      .setTitle('تشفير')
      .setCustomId('rep');

    const replacer = new TextInputComponent()
      .setCustomId('replacetext')
      .setLabel('اكتب منشورك هنا.')
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle('PARAGRAPH');

    const rows = [new MessageActionRow().addComponents(replacer)];
    modal.addComponents(...rows);
    await interaction.showModal(modal);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "rep") {
    let text = interaction.fields.getTextInputValue('replacetext');
    let replaced = false;

    replace.forEach(t => {
      const regex = new RegExp(t.word, 'g');
      if (regex.test(text)) {
        text = text.replace(regex, t.replace);
        replaced = true;
      }
    });

    if (replaced) {
      await interaction.reply({ content: `\`تم بنجاح تشفير منشورك :\`\n\n ${text}`, ephemeral: true });
    } else {
      await interaction.reply({ content: "**عذرا حدث خطأ ما منشور غير صالح برجاء تاكد من منشورك ومحاولة مره اخرى.**", ephemeral: true });
    }
  }
});
