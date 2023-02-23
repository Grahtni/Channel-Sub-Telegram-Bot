require("dotenv").config();
const { Bot } = require("grammy");

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Commands

bot.command("start", async (ctx) => {
  await ctx
    .reply(
      "*Welcome!* ✨\n_This is a utility bot used by @anzubo to check whether users of bots are subscribed to updates channel.\nIf you want to create your own the source code is located in /help._",
      {
        parse_mode: "Markdown",
      }
    )
    .then(console.log("New user added:\n", ctx.from))
    .catch((e) => console.error(e));
});

bot.command("help", async (ctx) => {
  await ctx
    .reply(
      "*@anzubo Project.*\n\n_This is a utility bot for @anzubo.\nUnauthorized access is not allowed.\nTo deploy your own:_",
      { parse_mode: "Markdown" }
    )
    .then(console.log("Help command sent to", ctx.from.id))
    .catch((e) => console.error(e));
});

// Messages

bot.on("msg", async (ctx) => {
  await ctx.reply("Works");
});

// Run

bot.start();
