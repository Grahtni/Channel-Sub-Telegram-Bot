require("dotenv").config();
const { Bot, webhookCallback, HttpError, GrammyError } = require("grammy");

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// DB

const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Admin

let BOT_DEVELOPER = 0 | process.env.BOT_DEVELOPER;
bot.use(async (ctx, next) => {
  ctx.config = {
    botDeveloper: BOT_DEVELOPER,
    isDeveloper: ctx.from?.id === BOT_DEVELOPER,
  };
  await next();
});

// Commands

bot.command("start", async (ctx) => {
  await ctx
    .reply(
      "*Welcome!* ✨\n_This is a utility bot used by @anzubo to check whether users of bots are subscribed to updates channel.\nIf you want to create your own the source code is located in /help._",
      {
        parse_mode: "Markdown",
      }
    )
    .then(() => {
      connection.query(
        `
  SELECT * FROM users WHERE userid = ?
  `,
        [ctx.from.id],
        (error, results) => {
          if (error) throw error;
          if (results.length === 0) {
            connection.query(
              `
      INSERT INTO users (userid, username, firstName, lastName, firstSeen)
      VALUES (?, ?, ?, ?, NOW())
    `,
              [
                ctx.from.id,
                ctx.from.username,
                ctx.from.first_name,
                ctx.from.last_name,
              ],
              (error, results) => {
                if (error) throw error;
                console.log("New user added:", ctx.from);
                return;
              }
            );
          } else {
            console.log("User exists in database.", ctx.from);
            return;
          }
        }
      );
    })
    .catch((error) => console.error(error));
});

bot.command("help", async (ctx) => {
  await ctx
    .reply(
      "*@anzubo Project.*\n\n_This is a utility bot for @anzubo.\nUnauthorized access is not allowed.\nTo deploy your own:\nhttps://github.com/Grahtni/Channel-Sub-Telegram-Bot_",
      { parse_mode: "Markdown" }
    )
    .then(console.log("Help command sent to", ctx.from.id))
    .catch((e) => console.error(e));
});

bot.command("cmd", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx
      .reply("*You are not authorized to use this command.*", {
        parse_mode: "Markdown",
      })
      .then(console.log("Unauthorized use by", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  } else {
    await ctx
      .reply("*Commands*\n\n_1. /list List users\n2. /last Last 3 joins_", {
        parse_mode: "Markdown",
      })
      .then(console.log("Commands list sent to", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  }
});

bot.command("list", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx
      .reply("*You are not authorized to use this command.*", {
        parse_mode: "Markdown",
      })
      .then(console.log("Unauthorized use by", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  } else {
    let members = await bot.api.getChatMemberCount(process.env.CHANNEL_ID);
    await ctx
      .reply(`*List Users*\n_The channel has ${members} subscribers._`, {
        parse_mode: "Markdown",
      })
      .then(console.log("List command sent to", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  }
});

bot.command("last", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx
      .reply("*You are not authorized to use this command.*", {
        parse_mode: "Markdown",
      })
      .then(console.log("Unauthorized use by", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  } else {
    await ctx
      .reply("*Last 3 Joins*", {
        parse_mode: "Markdown",
      })
      .then(console.log("Last command sent to", ctx.from.id))
      .catch((e) => console.error(e));
    return;
  }
});

// Messages

bot.on("message", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx.reply(
      "_This is a private utility bot for @anzubo.\nUnauthorized use is not allowed._",
      { parse_mode: "Markdown" }
    );
    return;
  } else {
    await ctx.reply(
      "*Welcome admin ✨*\n_Commands available:\n\n1. /list List users\n2. /last Last 3 joins_",
      {
        parse_mode: "Markdown",
      }
    );
    return;
  }
});

// Error

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(
    "Error while handling update",
    ctx.update.update_id,
    "\nQuery:",
    ctx.msg.text
  );
  if (ctx.config.isDeveloper) {
    ctx.reply("An error occurred");
  } else {
    bot.api.sendMessage(
      ctx.config.botDeveloper,
      "Query: " +
        ctx.msg.text +
        " by @" +
        ctx.from.username +
        " ID: " +
        ctx.from.id +
        " errored!"
    );
  }
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Run

export default webhookCallback(bot, "http");
