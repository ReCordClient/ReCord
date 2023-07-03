const fs = require("fs");
const path = require("path");

/*
    Debug using `%localappdata%\Discord\app-1.0.9013\Discord.exe`
*/

const electron = require("electron");
const { BrowserWindow } = electron;

const SettingsPopup = require(path.join(__dirname, "src/parts/SettingsPopup.js"));
const Elements = require(path.join(__dirname, "src/Elements.js"));
const _ConfigServer = require(path.join(__dirname, "src/ConfigServer.js"));
const ConfigSaver = require(path.join(__dirname, "src/ConfigSaver.js"));
const _App = require(path.join(__dirname, "src/parts/App.js"));
const App = new _App.App();
const _BuiltinStyles = require(path.join(__dirname, "src/RCBuiltInStyling.js"));
const BuiltinStyles = new _BuiltinStyles();
const EventEmitter = require(path.join(__dirname, "src/Events.js"));
const ProtoFixes = require(path.join(__dirname, "src/ProtoFixes.js"));

console.log("App", App);
console.log("EventEmitter", EventEmitter);

// fs.writeFileSync(
//     path.join(__dirname, "hi.txt"),
//     "Hello from the injected script!"
// );

const appdata = path.join(process.env.APPDATA, 'ReCord');
const extensionsDir = path.join(appdata, 'extensions');
const themesDir = path.join(appdata, 'themes');

if (!fs.existsSync(extensionsDir)) 
    fs.mkdirSync(extensionsDir, { recursive: true });

if (!fs.existsSync(themesDir))
    fs.mkdirSync(themesDir, { recursive: true });


const extensions = fs.readdirSync(extensionsDir)
    .filter((file) => file.endsWith('.ext.js'));

const ConfigServer = new _ConfigServer();



let interval = setInterval(() => {
    try {
        //check if window loaded
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        if (win.webContents.isLoading()) return;

        //console.log(BuiltinStyles.GetRemoveNitroGradientsFunction().toString());

        App.Run(`
        (${ProtoFixes.toString()})();

        window.RC = {};
        window.RC.Themes = ${JSON.stringify(ConfigServer.Themes)};
        window.RC.EnabledThemes = ${JSON.stringify(ConfigServer.EnabledThemes)};
        window.RC.EnabledThemesCSS = ${JSON.stringify(ConfigServer.EnabledThemesCSS)};
        window.RC.Settings = ${JSON.stringify(ConfigServer.GeneralSettings)};
        window.RC.Elements = new ${Elements.toString()};
        window.RC.SettingsPopup = ${SettingsPopup.toString()};
        window.EventEmitter = ${EventEmitter.toString()};

        (${ConfigSaver.toString()})();
        `);
        App.Run(BuiltinStyles.Setter());

        
        App.Run(function() {
            //document.body.style.backgroundColor = "red";
            window.waitForElm = (selector, checkForExists = true) => {
                return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }
                    
                    let observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (!mutation.addedNodes) return
                            
                            for (let i = 0; i < mutation.addedNodes.length; i++) {
                                if (checkForExists && document.querySelector(selector)) {
                                    resolve(document.querySelector(selector));
                                    observer.disconnect();
                            } else if (!checkForExists && !document.querySelector(selector)) {
                                resolve(null);
                                observer.disconnect();
                            }
                        }
                    })
                })
                
                
                
                observer.observe(document.body, {
                    childList: true
                    ,   subtree: true
                    ,   attributes: false
                    ,   characterData: false
                    })
                    
                });
            }

            window.listenForElm = (selector, callback, checkForExists = true) => {
                //run code whenever #selector is CREATED, not when it exists. WHEN IT IS CREATED
                //ALSO, if it removed and re-added, it will trigger again

                let hasCheckedThisExistance = false;
                
                let observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (!mutation.addedNodes) return
                        
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            if (checkForExists && document.querySelector(selector) && !hasCheckedThisExistance) {
                                callback(document.querySelector(selector));
                                //observer.disconnect(); don't disconnect, but don't trigger until it's removed and re-added
                                hasCheckedThisExistance = true;
                                break;
                                
                            } else if (!checkForExists && !document.querySelector(selector) && !hasCheckedThisExistance) {
                                callback(null);
                                ///observer.disconnect();
                                hasCheckedThisExistance = true;
                                break;
                            }

                            if (hasCheckedThisExistance && !document.querySelector(selector)) 
                                hasCheckedThisExistance = false;
                            
                        }
                    })
                })

                observer.observe(document.body, {
                    childList: true
                    ,   subtree: true
                    ,   attributes: false
                    ,   characterData: false
                })
            };
            
            // document.head.appendChild(document.createElement("script")).innerHTML = EventEmitter.toString();
            
            
            // console.log("EventEmitter", EventEmitter);
            window.RC.Events = new EventEmitter();

            waitForElm('[aria-label="Direct Messages"]').then((elm) => {
                window.RC.Events.emit("apps_ready");
            })

            listenForElm('[aria-label="My Account"]', (elm) => {
                console.log("Settings opened!");
                window.RC.Events.emit("settings_opened");
            })

            listenForElm('[aria-label="My Account"]', (elm) => {
                window.RC.Events.emit("settings_closed");
            }, false)

            waitForElm('[style="flex: 1 1 auto;"]>[class*="buttons-"]>button[type="button"][class*="lookFilled-"][class*="grow-"]', true).then((elm) => {
                let parent = elm.parentElement;

                elm.remove()

                let note = document.querySelector('[class*="note-"]').children[0];

                note.style.color = "var(--bg-gradient-citrus-sherbert-2)";

                note.children[0].innerHTML = "ReCord has crashed unexpectedly. Please reload Discord to continue using ReCord.";
                note.children[1].innerHTML = "This can be done by press ALT+F4, ending via command line or task manager and re-opening Discord.";

            })

            window.RC.Events.on("settings_opened", () => {
                console.log("Settings opened!");
                window.RC.Elements.grabSectionTitleClassAttrs();
                window.RC.SettingsPopup();
            })

            window.RC.Events.on("apps_ready", () => {
                let theme_style = document.createElement("style");
                let inner = "";
                for (let i = 0; i < window.RC.EnabledThemesCSS.length; i++) {
                    console.log("CSS", window.RC.EnabledThemesCSS[i]);
                    inner += window.RC.EnabledThemesCSS[i];
                }

                theme_style.innerHTML = inner;

                /*
                //TODO: FIX THIS

                if (inner.match(/background[-]?(a-zA-Z0-9-)*?:/g)) {
                    listenForElm('style[data-client-themes="true"][data-rh="true"]', (elm) => {
                        console.log("Removing old theme style...");
                        console.log(elm);
                        elm.innerHTML = "";
                        elm.remove();

                        
                    })

                    let nitro_style = document.createElement("style");
                    nitro_style.innerHTML = `.custom-theme-background {
                        --custom-theme-background: '' !important;
                    }`
                    document.head.appendChild(nitro_style);
                }
                */

                

                document.head.appendChild(theme_style);
            })
            
            
            //alert("Injected script loaded!");
            document.querySelector('[class*="tip-"]').innerHTML = "ReCord is starting...";
            
            document.head.appendChild(document.createElement("script")).innerHTML = `console.log("Injected script loaded!");`;
        });
        
        clearInterval(interval);
    } catch (e) {
        console.error(e);
    }
}, 50);
