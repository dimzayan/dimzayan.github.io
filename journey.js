
// const centerInView = (engine, parent) => {
//     const children = Object.values(engine.entities).filter(entity => entity.parent === parent.id)
//     const selected = children.find(entity => entity.active)

   
//     if(!selected) {
//         return
//     }

//     console.info('centerInView', selected.position[1] , parent.offset[1])

//     parent.offset[1] =(- selected.offset[1] + (window.innerHeight/5)) 
//     parent._dirty = true;
// }


const menuSystem = {

    

    onInit: function(engine, ctx) {


        this.offset = 400
        this.lists = Object.values(engine.entities).filter(entity => entity.list)
        for(const list of this.lists) {
            list._defaultOffset = [...list.offset]
        }
        this._refresh(engine, ctx)

  


        

    },

    onMount: function(engine, ctx) {

        if(!ctx.data) { return }

        const {entity, container} = ctx.data;


        if(!entity.menuItem) { return }

        console.log("MOUNTING", entity, container)

        container.classList.add('menuItem');

      

  
        gsap.set(container, {opacity: 0, x: -1200, skewX: -45, scale: 0.6, skewY: 25, autoAlpha: true})
        gsap.to(container, { scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'top 40%',
            scrub: 1,
            
            onLeave: () => {
                engine.activate(entity.id)
                
            },

            onUpdate: (scrollTrigger) => {
                engine.progress = scrollTrigger.progress
            },
            markers: true
            
        }, autoAlpha: 1, opacity: 1, x: 0, scale: 1, skewX: 0, skewY: 0, ease: 'expo3.inOut'})
    
        // entity.scrollTrigger = ScrollTrigger.create(scrollTrigger)
        gsap.to(container, {
            immediateRender: false,
            scrollTrigger: {
                trigger: container,
                start: 'bottom 40%',
                end: 'bottom top',
                scrub: 1,
                onEnter: () => {
                   // engine.deactivate(entity.id)
                },

                onLeaveBack: () => {
                    engine.activate(entity.id)
                }
                // markers: true,
            },
            autoAlpha: 1, opacity: 0, x: -1200, skewX: 45, scale: 0.6, skewY: 25, ease: 'expo2.inOut'})
        
        
    },


    onActivate: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        if(!entity.menuItem) {
            return
        }
        const parent = engine.entities[entity.parent]
        if(parent.selected) {
            engine.deactivate(parent.selected)
  
        }
        parent.selected = entity.id
        parent._dirty = true
        this.onSelect(engine, {entity: entity.id})
    },

    _refresh: function(engine, ctx) {

       
        for(const list of this.lists) {

            if(engine.mode === 'mobile') {
       
                list.offset = [20, 20]
                list.size = [window.innerWidth - 40, window.innerHeight ]
                list.itemSize = [window.innerWidth - 40, window.innerHeight * 0.8]
                list.fontSize = 1
                
            } else {
    
               
                list.offset = [...list._defaultOffset]
                list.size = [400, window.innerHeight]

                list.fontSize = 1
            
            }

          
            const offset = [0,0];
            let index = 0

            for(const child of Object.values(engine.entities).filter(entity => entity.parent === list.id)) {
                
                if(index === 0) {
                   
                    list.selected = child.id
                }
                child.offset = [offset[0], offset[1]];
                child._dirty = true;
                // child.size = child.size || [...list.itemSize]
            
                // offset[1] += child.size[1] + list.padding;
                child.menuItem = true;
                child.fontSize = list.fontSize;
                engine.enable(child.id)
                console.log(`Adding ${child.id} to menu`)
                index++
            }

            // list.size[1] = offset[1]
           

           

            list._dirty = true
        }
    },
    onResize: function(engine, ctx) {
     
    },
    
    onUpdate: (engine, ctx) => {
        
        
    },

    onScroll: function(engine, ctx) {
       
    },

    onAnimationComplete: function(engine, ctx) {
        // console.info('onAnimationComplete', ctx.data.entity)
    },

    onSelect: function(engine, ctx) {


        if(!ctx.entity ) {
            console.error('No entity set')
            return 
        }


        
        const entity = engine.entities[ctx.entity]

        if(!entity.menuItem) {
            return
        }
     
        
        console.assert(entity.parent, 'No parent set', entity)

        const menu = engine.entities[entity.parent]
        menu._dirty = true
    

        if(entity.onSelect) {
           engine.processCommand(entity.onSelect)
        }
       
 
        
    }
}



const selectableSystem = {


    onClick: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        if(entity.clickable) {
            if(engine.activate(entity.id)) {
                events.push({id: 'onSelect', entity: entity.id})
            }
        }
    }
}