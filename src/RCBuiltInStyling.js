const fs = require("fs");
const path = require("path");

module.exports = class {
    constructor() {
        this.Get();
        return this;
    }
    Get() {
        this.files = path.join(__dirname, "css");
        this.css = fs.readdirSync(this.files).map((file) => 
            fs.readFileSync(path.join(this.files, file), "utf-8"))
                .join("\n");
    }

    Set(document, css=null) {
        let style = document.createElement("style");
        if (!css) css = this.css;
        style.innerHTML = css;
        
        document.head.appendChild(style);
    }

    Setter() {
        return `(function() {
            let style = document.createElement("style");
            style.innerHTML = \`${this.css}\`;
            document.head.appendChild(style);
        })();`;
    }

}