
<p align="center">
    <image src="assets/blurple.png" width="400" height="400">
    <br>
    <h1 align="center" style="font-size: 56px;">ReCord</h1>
</p>

<br>

# An Open-Source Discord Mod

## Features

-  [x] Supports themes from other mods ([BetterDiscord](https://github.com/BetterDiscord), [Vencord](https://github.com/Vencord), etc.)
-  [x] Easily installed and uninstalled
-  [x] Extremely low ban chance (practically none)

## TO-DO

-  [ ] Plugin support
-  [ ] Auto disabling of nitro themes when themes require it.
-  [ ] Parse info comments at top of theme files.


## Installation

**Currently there is no installer, so you will have to manually install ReCord.**

1. First of all, you must clone this repository into a place that **will not be deleted**.
2. Close the Discord client you are installing ReCord to.
3. Find your discord installation folder. Replace $CHANNEL with the channel you are using (`discord` (stable), `discordcanary` (canary), `discordptb` (ptb)).

    - On Linux, `~/.config/$CHANNEL/`.
    - On Windows, this is usally `%localappdata%/$CHANNEL`. However, it may be `%programdata%/<username>/$CHANNEL`).
    - On Mac, `~/Library/Application Support/$CHANNEL/`.
4. Once in this folder, navigate to the highest version folder (e.g. `1.0.9013`). Then, navigate to `modules/discord_desktop_core` (or `discord_desktop_core-1` or `discord_desktop_core-2`). If there is a subfolder of `discord_desktop_core`, enter it.
5. Open the index.js file in a text editor.
6. Add the path to where you cloned this to in a require function. It should look something like this: 
```js
require("C:\\Coding\\js\\ReCord")
module.exports = require('./core.asar');
```
7. Save the file and open Discord. ReCord should now be installed.
8. You can place themes in:
    - On Linux, `~/.config/ReCord/themes`.
    - On Mac, `~/Library/Application Support/ReCord/themes`.
    - On Windows, `%appdata%/ReCord/themes`.
9. After installing themes, you must restart Discord for them to take effect. This can be done via ending the processes via task manager/terminal, or by pressing ALT+F4 on Windows or CMD+Q on Mac.
