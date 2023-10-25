module.exports = function () {
    const removeClass = () => {if (document.querySelector('.rc-tab.selected-RC')) document.querySelector('.rc-tab.selected-RC').classList.remove('selected-RC')}
    const addClass = () => {if (document.querySelector('.rc-tab:not(.selected-RC)')) document.querySelector('.rc-tab:not(.selected-RC)').classList.add('selected-RC')}
    const removeSelectedFromOthers = () => {
        let tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        tabs.forEach((tab) => {
            // console.log(tab);
            if (!tab.classList.contains("rc-tab") &&
                tab.matches('[class*="selected_"]')) {
                tab.setAttribute("class", tab.getAttribute("class").replace(/selected-.+? /, ""));
                tab.setAttribute("aria-selected", "false");
            }
        })
    }


    //insert a h1 after an element with the "Game Overlay" innerHTML element
    let insertTab = Array.from(document.querySelectorAll('[role="tab"]')).filter((tab) => {
        // console.log(tab.innerHTML);
        return tab.innerHTML === "Game Overlay";
    })[0]

    
    let rc_settings_tab = RC.Elements.generateSettingsTab("ReCord Settings", () => {
        let main = document.querySelector('[role="tabpanel"][id$="-tab"][class*="contentColumn_"]')

        addClass();
        removeSelectedFromOthers();
        
        //remove all non-[0] children
        while (main.children.length > 1) {
            main.children[1].remove();
        }
        let body = main.children[0];
        //body.innerHTML = `Dank memes!`;
        body.innerHTML = "";
        body.appendChild(RC.Elements.generateSettingContentSectionTitle("ReCord Settings")),

        body.appendChild(RC.Elements.generateElementFlexColList(
            // RC.Elements.BR(),
            // RC.Elements.BR(),
            // RC.Elements.BR(),
            // RC.Elements.BR(),
            RC.Elements.marginBottomAppendChildren(
                RC.Elements.generateSectionTitleList(
                    RC.Elements.generateSettingsTitle("Themes"),
                ),
                RC.Elements.marginTopAppendChildren(
                    RC.Elements.marginBottomAppendChildren(
                        RC.Elements.generateSettingDescriptionText("Themes can be used to customise the look of Discord. ReCord supports themes made for BetterDiscord, Vencord, and most other client modifications.\n\nThemes can be installed by dragging and dropping them into the Themes folder in %appdata%\\ReCord\\themes.\n\nBefore using any themes, made sure to disable any nitro themes if your theme needs you to."),
                    ),
                    RC.Elements.generateElementFlexColList(
                        ...RC.Elements.getThemeRowElements()
                    )
                )
            )
        ));

        RC.Elements.addFunctionalityToThemeSliders();
        setTimeout(() => {
            RC.Elements.updateThemeSliders();
        }, 50);
        
        console.log("clicked!");
    }, Array.from(insertTab.attributes));
    
    let seperator = RC.Elements.generateSettingsSeperator(insertTab);
    
    insertTab.insertAdjacentElement("afterend", rc_settings_tab);
    insertTab.insertAdjacentElement("afterend", RC.Elements.generateSettingsTitle("ReCord"));
    insertTab.insertAdjacentElement("afterend", seperator);

    document.querySelectorAll('[role="tab"]').forEach((tab) => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('selected-RC')) return;
            
            removeClass();
        })
    })


    //<div class="header-2F5_LB" tabindex="-1" role="button"><div class="eyebrow-1Shfyi headerText-10ez_d" data-text-variant="eyebrow">Activity Settings</div></div>

}