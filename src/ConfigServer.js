const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const [host, iphost, port] = ['localhost', '127.0.0.1', 7251];

module.exports = class ConfigServer {
    ThemesFolder = path.join(process.env.APPDATA, 'ReCord', 'themes');
    Themes = fs.readdirSync(this.ThemesFolder).filter((file) => file.endsWith('.css'));

    GeneralSettingsPath = path.join(process.env.APPDATA, 'ReCord', 'settings.json')
    GeneralSettings = {}

    EnabledThemes = []
    EnabledThemesCSS = []

    
    GetThemes(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.Themes));
    }

    EnableTheme(req, res, theme) {
        if (!theme) {
            res.writeHead(400);
            return res.end("No theme specified");
        }

        console.log(theme)  
        
        if (this.GeneralSettings.themes.includes(theme)) {
            res.writeHead(200);
            return res.end("Theme already enabled");
        }
        this.GeneralSettings.themes.push(theme);
        fs.writeFileSync(this.GeneralSettingsPath, JSON.stringify(this.GeneralSettings, null, 4));
        
        console.log(this.GeneralSettings)
        
        res.writeHead(200);
        res.end("Theme enabled");
    }

    DisableTheme(req, res, theme) {
        if (!theme) {
            res.writeHead(400);
            return res.end();
        }
        //this.GeneralSettings.themes = this.GeneralSettings.themes.filter((theme) => theme != body.theme);
        this.GeneralSettings.themes = this.GeneralSettings.themes.filter((_theme) => _theme != theme);
        
        fs.writeFileSync(this.GeneralSettingsPath, JSON.stringify(this.GeneralSettings, null, 4));
        
        res.writeHead(200);
        res.end();
    }

    Proxy(req, res, url, protocol = http) {
        //just return the contens of url
        protocol.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/css' });
                res.end(data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            res.writeHead(400);
            res.end();
        });
    }

    FetchText(url, protocol = http) {
        return new Promise((resolve, reject) => {
            let data = '';
            protocol.get(url, (response) => {
                response.on('data', (chunk) => {
                    data += chunk.toString();
                });
            
                response.on('end', () => {
                    resolve(data);
                });
            }).on('error', (err) => {
                console.log('Error: ' + err.message);
                reject(err);
            });
        })
    }

    /**console.log(importStatement, url, 0);
                    let css3 = `${css2}`
                    css2 = css2.replace(importStatement, importContents);
                    
                    console.log(css3 === css2, css3.length, css2.length); */

    async FetchCSSImports(css) {
        let importRegex = /@import url\(['"]?(.*?)['"]?\);/g;
        let httpRegex = /http:\/\/[^\s)]+(?=['"]?\);)/g;
        let httpsRegex = /https:\/\/[^\s)]+(?=['"]?\);)/g;
        let urlRegex = /http[s]?:\/\/[^\s)]+(?=['"]?\);)/g;

        //get all imports, and replace it with the contents of the import
        let imports = css.match(importRegex);

        let css2 = css;

        if (imports) {
            for (const importStatement of imports) {
                // if (i >= imports.length) {
                //     console.log('done');
                //     return css2;
                // }
                let url = importStatement.match(urlRegex)[0].replace(/['"]?/g, '');
                let importContents = await this.FetchText(url, url.startsWith('https') ? https : http)

                // console.log(importStatement, url, 0);
                let css3 = `${css2}`
                if (importContents.includes('@import'))
                    css2 = css2.replace(importStatement, await this.FetchCSSImports(importContents));
                else
                    css2 = css2.replace(importStatement, importContents);
                    
                // console.log(css3 === css2, css3.length, css2.length);

                    
                    
                    // if (importContents.includes('@import'))
                    //     css2 = css2.replace(importStatement, this.FetchCSSImports(importContents));
                    // else
                    //     css2 = css2.replace(importStatement, importContents);
                    // console.log(css.substring(0, 350));
                    
                    
                    // i++;
                
            };

            return css2;

        } else
            //return new Promise((resolve, reject) => resolve(css));
            return css;

    }

    constructor() {
        if (!fs.existsSync(this.GeneralSettingsPath)) {
            this.GeneralSettings = {
                "themes": [],
            }
            
            fs.writeFileSync(this.GeneralSettingsPath, JSON.stringify(this.GeneralSettings, null, 4));
        } else {
            this.GeneralSettings = JSON.parse(fs.readFileSync(this.GeneralSettingsPath));
        }

        this.EnabledThemes = this.GeneralSettings.themes;
        //this.EnabledThemesCSS = this.EnabledThemes.map((theme) => fs.readFileSync(path.join(this.ThemesFolder, theme + '.theme.css'), 'utf-8').replace(/http[s]\:\/\//g, `https://${iphost}:${port}/proxy/`));

        this.EnabledThemesCSS = []
        for (let i = 0; i < this.EnabledThemes.length; i++) {
            let theme = this.EnabledThemes[i];
            let css = fs.readFileSync(path.join(this.ThemesFolder, theme + '.theme.css'), 'utf-8')
                .replace(/\[class*="([a-z0-9A-Z\-_]+-)"\]/g, (match) => match.replace('-', '_'))
                .replace(/\.([A-Za-z0-9]+)-[A-Za-z0-9\-_]{6}/g, (str, m1) => {
                    const replacement = `[class*="${m1}"]`
                    console.log(`Replacing ${str} with ${replacement}`)
                    return replacement
                })
            console.log(css)
            this.FetchCSSImports(css).then((css2) => {
                // console.log(css2, theme, i);
                this.EnabledThemesCSS.push(css2);
            })
            
        };

        
        
        let _this = this;

        this.RequestListener = function (req, res) {
            res.setHeader('Access-Control-Allow-Origin', 'https://discord.com');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Content-Security-Policy', `default-src 'none'; style-src 'unsafe-inline' 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com; img-src 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com; script-src 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com; connect-src 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com; font-src 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com; frame-src 'self' https://discord.com https://${iphost}:${port} https://*.discord.com https://*.discordapp.com;`);

            

            
            console.log(req.url)
            console.log(req.url.substring('/enable_theme/'.length))

            if (req.url == '/themes')
                _this.GetThemes(req, res)
            else if (req.url.startsWith('/enable_theme/'))
                _this.EnableTheme(req, res, req.url.substring('/enable_theme/'.length));
            else if (req.url.startsWith('/disable_theme/'))
                _this.DisableTheme(req, res, req.url.substring('/disable_theme/'.length));
            else if (req.url.startsWith('/proxy/'))
                _this.Proxy(req, res, req.url.substring('/proxy/'.length));
            else {
                res.writeHead(404);
                res.end();
            }


            

            // res.writeHead(200);
            // res.end('Hello, World!');
        }

        this.server = http.createServer(this.RequestListener);
        this.server.listen(port, host, () => {
            console.log(`ReCord Config Server is running on http://${host}:${port}`);
        })
    }
}