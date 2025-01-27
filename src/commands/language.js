const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the language for the current guild')
    .addSubcommand((subcommand) => subcommand
      .setName('english')
      .setDescription('Set the language to english'))
    .addSubcommand((subcommand) => subcommand.setName('german').setDescription('Set the language to german')),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    let languageembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Language } = require(`../languages/${result.language}.json`);
        if (
          interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
          switch (interaction.options.getSubcommand()) {
            case 'english': {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async () => {
                  await guildLang
                    .findOneAndUpdate(
                      { guildID: interaction.guild.id },
                      {
                        language: 'en_EN',
                      },
                    )
                    .catch();
                });
              languageembed = new EmbedBuilder()
                .setTitle('Language changed!')
                .setDescription('English has been selected as the language!')
                .setFooter({
                  text: 'Would You',
                  iconURL: client.user.avatarURL(),
                });
              break;
            }

            case 'german': {
              guildLang
                .findOne({ guildID: interaction.guild.id })
                .then(async () => {
                  await guildLang
                    .findOneAndUpdate(
                      { guildID: interaction.guild.id },
                      {
                        language: 'de_DE',
                      },
                    )
                    .catch();
                });
              languageembed = new EmbedBuilder()
                .setTitle('Sprache bearbeitet!')
                .setDescription('Deutsch wurde als Sprache ausgewählt!')
                .setFooter({
                  text: 'Would You',
                  iconURL: client.user.avatarURL(),
                });
              break;
            }
          }
          try {
            await interaction.reply({
              embeds: [languageembed],
              ephemeral: true,
            });
          } catch (error) {}
        } else {
          const errorembed = new EmbedBuilder()
            .setColor('#F00505')
            .setTitle('Error!')
            .setDescription(Language.embed.error);
          await interaction.reply({
            embeds: [errorembed],
            ephemeral: true,
          });
        }
      });
  },
};
