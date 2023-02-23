# Channel Sub Telegram Bot

Use this to check whether users are subscribed to channel.

<br>

### Install

1. Clone git repo.
2. Run ```npm i``` in project folder. This will install the required dependencies.
3. Populate .env file with bot token, bot dev ID and channel ID.

#### Bot token can be obtained from @BotFather.

#### Bot dev ID refers to the user ID of your Telegram account. This is needed for logging purposes.

4. Run ```node bot``` to start the bot.

5. Add it to the channel to be monitored.

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution, as this ensures you won't have to have the terminal open. You can set up auto-start as well. Or pass a cron job.

<br>

### Uninstall

1. Use ```rm -rf```.

*Note:* If you're unfamiliar with this command, delete project folder from file explorer.

<br>

### Mechanism

The bot detects for changes in the subscribers of bot and logs it to a Planetscale database.

<br>


    Copyright (C) 2023  Zubin

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

