const MODULE_ID = 'split-bars';


function drawBars_Wrapper(wrapped, ...args) {
    // Once everything else is done, draw segmentation on top
    let result = wrapped(...args);
    ["bar1", "bar2"].forEach((b, i) => {

        // Check if there's rules for the bar
        if((i == 0 && hasProperty(this.document, 'flags.split-bars.rule1')) || (i == 1 && hasProperty(this.document, 'flags.split-bars.rule2'))) 
        {
            if (this.hud?.bars || this.bars)
            {
                const bar = (this.hud?.bars[b] || this.bars[b]);
                const attr = this.document.getBarAttribute(b);
                if ( !attr || (attr.type !== "bar") ) return bar.visible = false;
                
                // Get the appropriate rule
                if(i==0)
                    statements = this.document.getFlag(MODULE_ID, "rule1").split(" ");
                if(i ==1)
                    statements = this.document.getFlag(MODULE_ID, "rule2").split(" ");
                
                for(ex of statements)
                {
                    let repeat = false;
                    if(ex.includes(":"))
                    {
                        repeat = true;
                        ex = ex.replace(/:/g, "")
                    } 
                   
                    if(ex.includes("%"))
                    {
                        ex = ex.replace(/%/g, "");
                        ex = Number(ex)/100;
                        ex = ex.toString();
                    } 

                    if(ex.includes("/"))
                    {
                        let div = ex.split("/")
                        ex = Number(div[0])/Number(div[1])
                        ex = ex.toString();
                    }
                    
                    let pct = Number(ex);

                    if (isNaN(pct)) 
                    {
                        console.warn("Split Bars | \"" + ex + "\" is not a supported expression!");
                        continue;
                    }
                    if(pct > Number(attr.max)) continue;

                    if(pct >= 1) pct = pct/Number(attr.max);
                    
                    let step = pct;
                    do{
                        draw_line(this, bar, pct);
                        pct += step;
                    } 
                    while (repeat && (pct < 1))
                    
                }
            }
        }
    });
	this.bars.visible = this._canViewMode(this.document.displayBars);

    return(result);
  }

function draw_line(ref, bar, pct) {
    let h = Math.max((canvas.dimensions.size / 12), 8);
    const w = ref.w;
    const bs = Math.clamped(h / 8, 1, 2);
    if ( ref.document.height >= 2 ) h *= 1.6;  // Enlarge the bar for large tokens

    // Determine the color to use
    const blk = 0x000000;

    // Draw the bar
    bar.lineStyle(bs, blk, 1).moveTo(pct*w, 0).lineTo(pct*w, h)
}

Hooks.once('setup', function () {

    libWrapper.register(MODULE_ID, 'Token.prototype.drawBars', drawBars_Wrapper, "WRAPPER");
})


Hooks.once('ready', () => {
    if(!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error("Module Split-Bars requires the 'libWrapper' module. Please install and activate it.");
});

Hooks.on('renderTokenConfig', (TokenConfig, html) => {
    const resourceTab = html.find(`[data-tab="resources"]`)[1].children;
    let rule1 = '';
    let rule2 = '';
    if(hasProperty(TokenConfig.token, 'flags.split-bars.rule1'))
    {
        rule1 = TokenConfig.token.getFlag(MODULE_ID, 'rule1');
    }
    if(hasProperty(TokenConfig.token, 'flags.split-bars.rule2'))
    {
        rule2 = TokenConfig.token.getFlag(MODULE_ID, 'rule2');
    }
    resourceTab[1].insertAdjacentHTML("afterend",
        `<div class = "form-group"><label>Bar 1 Split Rule</label><div class="form-fields"><input type = "text" name = "rule1" value = "${rule1}"></div>`
        );
    resourceTab[4].insertAdjacentHTML("afterend",
        `<div class = "form-group"><label>Bar 2 Split Rule</label><div class="form-fields"><input type = "text" name = "rule2" value = "${rule2}"></div>`
        );
});


Hooks.on('closeTokenConfig', (TokenConfig, html) => {
    let rule1 = html.find(`[name = "rule1"]`)[0].value;
    let rule2 = html.find(`[name = "rule2"]`)[0].value;
    if(rule1==='')
    {
        if(hasProperty(TokenConfig.token, 'flags.split-bars.rule1'))
            TokenConfig.token.unsetFlag(MODULE_ID, 'rule1')
    }
    else
    {
        TokenConfig.token.setFlag(MODULE_ID, 'rule1', rule1)
    }

    if(rule2==='')
    {
        if(hasProperty(TokenConfig.token, 'flags.split-bars.rule2'))
            TokenConfig.token.unsetFlag(MODULE_ID, 'rule2')
    }
    else
    {
        TokenConfig.token.setFlag(MODULE_ID, 'rule2', rule2)
    }
});
