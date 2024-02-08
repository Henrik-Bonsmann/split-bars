const MODULE_ID = 'split-bars';


function drawBars_Wrapper(wrapped, ...args) {
    // Once everything else is done, draw segmentation on top
    let result = wrapped(...args)

    if ( !this.actor || (this.document.displayBars === CONST.TOKEN_DISPLAY_MODES.NONE) ) {
		return this.bars.visible = false;
	}
    ["bar1", "bar2"].forEach((b) => {
		
		if (this.hud?.bars || this.bars)
		{
            const bar = (this.hud?.bars[b] || this.bars[b]);
            const attr = this.document.getBarAttribute(b);
            if ( !attr || (attr.type !== "bar") ) return bar.visible = false;
            
            let statements = game.settings.get(MODULE_ID, 'segments').split(" ");
            for(ex of statements)
            {
                let repeat = false;
                if(ex.includes(":"))
                {
                    repeat = true;
                    ex = ex.replace(/:/g, "")
                } 

                if(ex.includes("/"))
                {
                    let div = ex.split("/")
                    ex = Number(div[0])/Number(div[1])
                }

                let pct = Number(ex);

                if (isNaN(pct)) 
                {
                    console.warn("Split Bars | \"" + ex + "\" is not a supported expression!");
                    continue;
                }
                if(pct > Number(attr.max)) continue;
                if(pct > 1) pct = pct/Number(attr.max);
                
                let step = pct;
                do{
                    draw_line(this, bar, pct);
                    pct += step;
                } 
                while (repeat && (pct < 1))
                
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

Hooks.once('init', function () {

    game.settings.register(MODULE_ID, 'segments', {
        name: 'Segments',
        hint: 'Specify where to segment the bar',
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: String,       // Number, Boolean, String, Object
        default: ".5",
      });

});

Hooks.once('ready', () => {
    if(!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error("Module Split-Bars requires the 'libWrapper' module. Please install and activate it.");
});
