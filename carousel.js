
const carouselSystem = {
    onInit: function(engine, ctx) {

        const carousel = engine.entities.carousel
        carousel.size = [window.innerWidth - 400, window.innerHeight]
        carousel.offset = [400, 0]
    },

    onResize: function(engine, ctx) {

        const carousel = engine.entities.carousel

        if(engine.mode === 'mobile') {
            carousel.size = [window.innerWidth, window.innerHeight * 0.6]
            carousel.offset = [0, 400]
         
            
        } else {

            carousel.size = [window.innerWidth - 400, window.innerHeight]
            carousel.offset = [400, engine.scrollY]
        
        }
        
       
        carousel._dirty = true


        const works = Object.values(engine.entities).filter(e => e.enabled && e.work)
        
 

        for(const work of works) {
          
            work.size = [carousel.size[0] * 0.9, carousel.size[1] * 0.5]
            work.offset = [
                (carousel.size[0] - work.size[0])/2,
                (carousel.size[1] - work.size[1])/2
            ]
            
            work._dirty = true
        }
    },

    onScroll: function(engine, ctx) {
        const carousel = engine.entities.carousel
        carousel.offset[1] = engine.scrollY
        carousel._dirty = true
    },

    onActivate: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        if(entity.carousel) {
            
            entity.startTime = ctx.timestamp
           
           
        }
    },

    onSelectWorks: function(engine, ctx) {
        const carousel = engine.entities.carousel
        const works = Object.values(engine.entities).filter(e => e.enabled && e.work)

        carousel.startTime = ctx.timestamp
        if(carousel.selected) {
            carousel.selected.opacity = 0
            engine.deactivate(carousel.selected)
        }
        
        engine.activate(carousel.id)

        for(const work of works) {
            work.opacity = 0
            work.size = [carousel.size[0] * 0.6, carousel.size[1] * 0.6]
            work.offset = [
                (carousel.size[0] - work.size[0])/2,
                (carousel.size[1] - work.size[1])/2
            ]
            
            work._dirty = true
        }

    },
    
    onUpdate: function(engine, ctx) {
        const timestamp = ctx.timestamp 
        const carousel = engine.entities.carousel

        const elapsed = timestamp - carousel.startTime
        const ticks = Math.floor(elapsed / carousel.tempo)
        
        // Find all active parents that have works (locations)
        const works = Object.values(engine.entities).filter(e => e.enabled && e.work)

       

        if(works.length > 0) {
            const work = works[ticks % works.length]
            
         
            if(work) {
                work.opacity = 1
            }
            if(work && work.id !== carousel.selected) {
                if(carousel.selected) {
                    carousel.selected.opacity = 0
                    engine.deactivate(carousel.selected)
                    
                }
                engine.activate(work.id)
                work.opacity = 1
                carousel.selected = work.id
                work.parent = carousel.id
                // work.size = carousel.itemSize
                work.offset = [
                    (carousel.size[0] - work.size[0])/2,
                    (carousel.size[1] - work.size[1])/2
                ]
                work._dirty = true
                
            }
            
      
            
        }

        
    }
}