


const parentSystem = {
    onUpdate: (engine, ctx) => {
        // for(const entity of Object.values(engine.entities).filter(e => e.parent )) {
        //     const parent = engine.entities[entity.parent]
        //     // if(parent.enabled && !entity.enabled) {
        //     //     entity.enabled = true;
        //     //     // entity.opacity = 1
        //     //     entity._dirty = true;
        //     // }

        //     // if(!parent.active) {
        //     //     entity._displayable = false
        //     // } else {
        //     //     entity._displayable = true
               
        //     // }
        // }
    }
}


const clickableSystem = {

    onMount: function(engine, ctx) {
     
        if(!ctx.data) { return }
        const {entity, container} = ctx.data;
        if(entity && entity.clickable && container) {
            container.dataset.clickable = true;

        }
      
    }
}





const transformableSystem = {
    components: {
        position: [0,0]
    },
    onScroll: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(e => e._displayable && e.enabled)) {
            entity._dirty = true;
        }
    },
    onInit: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(entity => entity.transformable)) {
            for(const [key, value] of Object.entries(this.components)) {
                entity.size = entity.size || [100, 100]
                entity.position  = entity.position || [0,0]
                entity.transform = {
                    local: [0,0,0,0],
                    global: [0,0,0,0]
                }
                entity._dirty = true

            }
        }
    },
    onUpdate: function(engine, ctx) {
        const transformableEntities = Object.values(engine.entities).filter(entity => 
            entity.transformable && entity.enabled && !entity._inCarousel // Skip carousel works
        )

        for(const entity of transformableEntities) {
            let index = 0;
            let offset = entity.offset || [0,0]
            let baseX = offset[0]
            let baseY = offset[1]

            // Calculate base position in document space (before scroll adjustment)
            if(entity.parent) { 
                let parent = entity.parent ? engine.entities[entity.parent] : null;
                // if(parent) {
                //     // Use parent's base offset, not scroll-adjusted position
                //     const parentOffset = parent.offset || [0, 0];
                //     baseX += parentOffset[0];
                //     baseY += parentOffset[1];
                // }
            }
      
            // Account for scroll position - entities with position:fixed need scroll adjustment
            // As user scrolls down, entities should appear to move up in viewport
            const scrollY = engine.scrollY || 0;
            const finalX = baseX + entity.transform.global[0];
            const finalY = baseY + entity.transform.global[1];// Subtract scroll to keep entities in place relative to content

            if(entity.position[0] !== finalX) {
                // console.log(entity.id + ' > '+entity.position[0] + '> '+finalX)
                entity.position[0] = finalX;
                entity._dirty = true
            }
            if(entity.position[1] !== finalY) {
                // console.log(entity.id + ' > '+entity.position[1] + '> '+finalY)
                entity.position[1] = finalY
                entity._dirty = true
            }

            if(entity._dirty) {
                engine.queueEvent('onChange', {entity: entity.id})
            }
     
        }
     
       
    }
}



const displayableSystem = {

    onResize: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(entity => entity._displayable && entity.enabled)) {
            entity._dirty = true;
        }
    },
    
    onInit: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(entity => entity._displayable )) {

            // entity._dirty = true;
            
        }
     
    },

    onActivate: function(engine, ctx) {

        const container = document.querySelector(`#${ctx.entity}`)
        container.classList.add('active')
    },

    onDeactivate: function(engine, ctx) {
     
        const container = document.querySelector(`#${ctx.entity}`)
        container.classList.remove('active')
    },
    onUpdate: (engine, ctx) => {
        let index = 0;
        let centerIndex = 0;
        let minDistance = Infinity;
        let centerEntityElement = null;

        
        for(const entity of Object.values(engine.entities).filter(entity => entity._displayable && entity._dirty)) {

            if(!entity.enabled) {

                entity.opacity = 0
            }
    


            engine.render(entity);
            entity._dirty = false
            
      
        }
    }
}
let padding = 12;
let entityWidth = 100;
let mouseDown = false;
let zoom = 0;
let position = {x: 0, y: 0};
let width = 0;



const systems = [
    // menuSystem,
    clickableSystem,
    // selectableSystem,
    // menuItemSystem,
    parentSystem,
    // carouselSystem,
    transformableSystem,
    sceneSystem,
    displayableSystem
]



// const run = (timestamp) => {
   
   
//     engine.events.push(...events)
//     events = []
        
//     engine.update(timestamp);
//     requestAnimationFrame(run);
// }






window.addEventListener('load', () => {

    window.addEventListener('resize', () => {

        engine.resize()
        engine.queueEvent('onResize')
        
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        
        
        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Queue onScroll event only after scrolling stops (150ms delay)
        // scrollTimeout = setTimeout(() => {
            engine.scrollY = window.scrollY || window.pageYOffset || 0;
            engine.queueEvent('onScroll', {timestamp: Date.now()});
        // }, 1);
    }, { passive: true });

    
    
    document.addEventListener('click', (e) => {

        
        if(e.target.dataset.action) {
            e.preventDefault();
            events.push({id: 'onClick', data: e.target.dataset})
            return
        }
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const clickableElement = elements.find(el => el.dataset.clickable);
        if(clickableElement) {
            events.push({id: 'onClick', entity: clickableElement.id})
        }
    });


    document.addEventListener('mousedown', (e) => {
        // console.log('mousedown', e)
    });

    document.addEventListener('mouseup', (e) => {
        // console.log('mouseup', e)
    });

    document.addEventListener('mouseover', (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        if(elements.find(el => el.classList.contains('media')) || elements.find(el => el.classList.contains('nav'))) {
            if(!engine.workHover) {
                engine.workHover = true;
                engine.queueEvent('onWorkIn')
            }
        } else {
            if(engine.workHover) {
                engine.workHover = false;
                engine.queueEvent('onWorkOut');
            }
        }
    });


    document.addEventListener('keydown', (e) => {
        console.log('keydown', e)
       switch(e.key) {
        case 'ArrowLeft':
            engine.queueEvent('onPrevious')
            break;
        case 'ArrowRight':
            engine.queueEvent('onNext')
            break;
        case 'ArrowUp':
            engine.queueEvent('onPrevious')
            break;
        case 'ArrowDown':
            engine.queueEvent('onNext')
            break;  
        case '.':
            engine.queueEvent('onSpace')
            break;
       }
    });
  
  
    
    engine.init(systems);
});
