module.exports = class {
    sectionTitleEl = null;

    themeRowFirstChildTemplate = `
        <div class="labelRow-NnoUIp">
            <label for="{1}" class="title-2yADjX">{0}</label>
            <div class="control-RC">
                <div class="container-RC-Slider" style="opacity: 1; background-color: rgb(128, 132, 142);" data-rc-for="{1}">
                    <svg class="slider-RC" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style="left: -3px;">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
                        <svg viewBox="0 0 20 20" fill="none">
                            <path fill="rgba(128, 132, 142, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path>
                            <path fill="rgba(128, 132, 142, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path>
                        </svg>
                    </svg>
                    <input id="{1}" type="checkbox" class="input-RC" tabindex="0"></div>
                </div>
            </div>
<!--        <div class="note-RC">
                <div class="colorStandard-RC size14-RC description-RC formText-2UzJT0 modeDefault-RC">{2}</div>
            </div>!-->
            <div class="divider-RC dividerDefault-RC"></div>
        </div>
    `

    themeRowTemplate = `
    <div class="container-RC-Section">
        ${this.themeRowFirstChildTemplate}
    </div>
    `

    settingDescriptionTextTemplate = `
    <div class="colorStandard-RC size14-RC description-RC formText-2UzJT0 description-RC-WSPW modeDefault-RC">
        {0}
    </div>
    `

    settingDescriptionAttrs = [
        "colorStandard-RC", "size14-RC", "description-RC", "formText-2UzJT0", "description-RC-WSPW", "modeDefault-RC"
    ]

    generateSettingsTab(innerHTML, onclick, attrs){
        if (!attrs) attrs = [];
        let tab = document.createElement("div");
        
        for (let attr of attrs) 
            tab.setAttribute(attr.name, attr.value);
        
        tab.classList.add("rc-tab");
        tab.innerHTML = innerHTML;
        
        if(onclick) tab.onclick = onclick;

        return tab;
    }
    
    generateSettingsTitle(innerHTML) {
        let existingTitle = document.querySelector('[role="button"][tabindex="-1"][class*="header_"]');
        
        let newTitle = existingTitle.cloneNode(true);
        
        newTitle.children[0].innerHTML = innerHTML;
        
        return newTitle;
    }

    generateSettingContentSectionTitle(title) {
        //get all html of sectionTitleEl
        let el = this.sectionTitleEl.cloneNode(true);
        el.children[0].innerHTML = title;

        return el;
    }

    grabSectionTitleClassAttrs() {
        setTimeout(() => {
            let el = document.querySelector('[class*="sectionTitle_"]:not([class*="peopleColumn_"])');

            if (!el) return null;

            this.sectionTitleEl = el.cloneNode(true);
            return this.sectionTitleEl;
        }, 100);
    }

    generateSettingsSeperator(insertTab) {
        let sep = document.createElement('div')
        sep.classList.add('separator_rc')
        return sep
    }

    generateThemeRow(name, path, enabled) {
        let r_id = `:rc-theme-${name}:`;

        let html = this.themeRowFirstChildTemplate.format(name, r_id, path);

        let el = document.createElement("div");
        el.innerHTML = html;

        el.classList.add("container-RC-Section", "custom-RC-ThemeRow");

        return el;
    }

    generateElementList(...elements) {
        let div = document.createElement("div");

        div.classList.add("children-RC");

        for (let el of elements) {
            div.appendChild(el);
        }
        console.log(div);
        return div;
    }

    generateElementFlexColList(...elements) {
        let div = document.createElement("div");

        div.classList.add("children-RC-FlexCol");

        

        for (let el of elements) {
            //console.log(el);
            //console.log(typeof el);
            div.appendChild(el);
        }

        return div;
    }


    generateSectionTitleList(...elements) {
        let div = document.createElement("div");

        div.classList.add("sectionTitle-RC");

        for (let el of elements) {
            div.appendChild(el);
        }

        return div;
    }

    toggleThemeSwitch() {

    }
    
    marginBottomAppendChildren(...elements) {
        let div = document.createElement("div");

        div.classList.add("marginBottom20-RC");

        for (let el of elements) {
            div.appendChild(el);
        }

        return div;
    }
    marginTopAppendChildren(...elements) {
        let div = document.createElement("div");

        div.classList.add("marginTop20-RC");

        for (let el of elements) {
            div.appendChild(el);
        }

        return div;
    }
    generateSettingDescriptionText(text) {
        let el = document.createElement("div");
        for (let attr of this.settingDescriptionAttrs) 
            el.classList.add(attr);

        el.innerHTML = text;

        return el;
    }

    BR() {
        return document.createElement("br");
    }

    getThemeRowElements() {
        return RC.Themes
            .map((theme) => theme.replace('.theme.css', ''))
            .map((theme) => 
                RC.Elements.generateThemeRow(theme, '%appdata%\\ReCord\\themes\\' + theme + '.theme.css', true))
    }

    sliderOnColour = `rgb(35, 165, 90)`
    sliderOffColour = `rgb(128, 132, 142)`

    enableThemeSlider(el, svg1, svg2, input, thname, visual=false) {
        el.style.backgroundColor = this.sliderOffColour;
        svg1.style.left = '-3px';
        
        svg2.innerHTML = `<path fill="rgba(128, 132, 142, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path>
        <path fill="rgba(128, 132, 142, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path>
        `

        input.checked = false;

        el.classList.remove('checked-RC');
        
        if (!visual) window.RC.Theme.Disable(thname);

        return;
    }

    disableThemeSlider(el, svg1, svg2, input, thname, visual=false) {
        el.style.backgroundColor = this.sliderOnColour;
        svg1.style.left = '12px';

        svg2.innerHTML = `
        <path fill="rgba(35, 165, 90, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path>
        <path fill="rgba(35, 165, 90, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path>
        `

        input.checked = true;

        el.classList.add('checked-RC');
        
        if (!visual) window.RC.Theme.Enable(thname);

        return;
    }

    addFunctionalityToThemeSliders() {
        let els = document.querySelectorAll('[data-rc-for]');
        for (let el of els) {
            el.addEventListener('click', () => {
                let thname = el.getAttribute('data-rc-for').replace(':rc-theme-', '').replace(':', '');
                let svg1 = el.children[0];
                let svg2 = el.children[0].children[1];
                let input = el.children[1];
                if (el.classList.contains('checked-RC')) {
                    this.enableThemeSlider(el, svg1, svg2, input, thname);
                } else {
                    this.disableThemeSlider(el, svg1, svg2, input, thname);
                }
            })
        }
    }

    updateThemeSliders() {
        let enabled = window.RC.EnabledThemes;
        console.log(enabled);

        for (let thname of enabled) {
            let el = document.querySelector(`[data-rc-for=":rc-theme-${thname}:"]`);
            let svg1 = el.children[0];
            let svg2 = el.children[0].children[1];
            let input = el.children[1];
            console.log(el);
            console.log(svg1);
            console.log(svg2);
            console.log(input);
            this.disableThemeSlider(el, svg1, svg2, input, thname, true);
        }
    }

    
    constructor(){

        return this;
    }
}