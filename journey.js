
const centerInView = (engine, parent) => {
    const children = Object.values(engine.entities).filter(entity => entity.parent === parent.id)
    const selected = children.find(entity => entity.active)

   
    if(!selected) {
        return
    }

    console.info('centerInView', selected.position[1] , parent.offset[1])

    parent.offset[1] =(- selected.offset[1] + (window.innerHeight/5)) + engine.scrollY
    parent._dirty = true;
}


const menuSystem = {

    _refresh: function(engine, ctx) {

       
        for(const list of Object.values(engine.entities).filter(entity => entity.list)) {

            if(engine.mode === 'mobile') {
       
                list.offset = [20, 20]
                list.size = [window.innerWidth - 40, window.innerHeight - 40]
                list.itemSize = [window.innerWidth - 40, window.innerHeight * 0.8]
                list.fontSize = 1
                
            } else {
    
               
                list.offset = [80, 80]
                list.size = [300, window.innerHeight]

                list.fontSize = 1.3
            
            }

          
            const offset = [0,0];

            for(const child of Object.values(engine.entities).filter(entity => entity.parent === list.id)) {
                
                child.offset = [offset[0], offset[1]];
                child._dirty = true;
                child.size = child.size || [...list.itemSize]
            
                offset[1] += child.size[1] + list.padding;
                child.fontSize = list.fontSize
            }

            list._dirty = true
        }
    },
    onResize: function(engine, ctx) {
        console.log(this)
        this._refresh(engine, ctx)
    },
    onInit: function(engine, ctx) {
        this._refresh(engine, ctx)
        
       
    },
    onUpdate: (engine, ctx) => {
        
        
    },

    onScroll: function(engine, ctx) {
       
    },

    onAnimationComplete: function(engine, ctx) {
        // console.info('onAnimationComplete', ctx.data.entity)
    },

    onSelect: (engine, ctx) => {


        if(!ctx.entity ) {
            console.error('No entity set')
            return 
        }

        
        const entity = engine.entities[ctx.entity]
     
        
        if(!entity.parent) {
            console.error('No parent set', entity)
        }
        
        const parent = engine.entities[entity.parent]
        parent._dirty = true
        const children = Object.values(engine.entities).filter(c => c.parent === parent.id)
        const index = 0;
        const offset = [0,0];
        entity.size[1] = 300
        entity.size[1] = Math.max(parent.itemSize[1], getTextHeight(entity))
        engine.activate(entity.id)

        if(entity.onSelect) {
           engine.processCommand(entity.onSelect)
        }
       
        for(const child of children) {
           

            child.offset = [offset[0], offset[1]];
            

            if(child.id !== entity.id) {
                child.active = false
                child.size[0] = parent.size[0]
                child.size[1] = 50
                
            } 

            offset[1] += child.size[1] + parent.padding;
           
            console.log(child.id, entity.id, offset[1], child.size[1], entity.size[1])
            child._dirty = true
    
          
            
        }

        centerInView(engine, parent)
        
        
    }
}

function getTextSize(text, font) {
    // Reuse canvas for better performance
    const canvas = getTextSize.canvas || (getTextSize.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return {
        width: metrics.width,
        height: parseInt(context.font, 10) // Approximate line height from font size
    };
}
  

const getTextHeight = (entity) => {
    const el = document.createElement('div');
    // el.classList.add('text');
    Object.assign(el.style, {
      position: 'absolute',
      top: '-9999px',
      left: '-9999px',
      whiteSpace: 'pre-wrap',
      width: entity.size[0]+'px',

      fontSize: '1.4em',
      fontFamily: 'Fira Sans',
     
      lineHeight: '1.4em',
      fontWeight: 400,
    });
    el.textContent = entity.text;
    console.warn(entity.id, entity.text)
    document.body.appendChild(el);
    const height = el.offsetHeight;
    console.warn(entity.id, height)
    document.body.removeChild(el);
    return height;
}

// const menuItemSystem = {
    
// }

const selectableSystem = {
    onActivate: (engine, ctx) => {
        if(!ctx.entity) {
            console.error('No entity set')
            return 
        }
        const entity = engine.entities[ctx.entity]
        
        if(!entity.active) {
            entity.active = true;
            entity._dirty = true;
            events.push({id:'onSelect', entity: ctx.entity})
        } 
    }
}