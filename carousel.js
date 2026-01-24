
const carouselSystem = {
    onInit: function(engine, ctx) {

        const carousel = engine.entities.carousel
        carousel.size = [window.innerWidth - 400, window.innerHeight]
        carousel.offset = [0, 0]
        carousel.works = []

        const works = Object.values(engine.entities).filter(e => e.work ) 

        for(const work of works) {
            work.parent = 'carousel'
            work.opacity = 0
            work._dirty = true
        }
    },

    onResize: function(engine, ctx) {

        const carousel = engine.entities.carousel

        if(engine.mode === 'mobile') {
            carousel.size = [window.innerWidth, window.innerHeight * 0.6]
            carousel.offset = [0, 400]
         
            
        } else {

            // carousel.size = [window.innerWidth * 0.8, window.innerHeight]
            // carousel.offset = [0, 0]
        
        }
        
       
        carousel._dirty = true


        const works = Object.values(engine.entities).filter(e => e.enabled && e.work)
        
 

        for(const work of works) {
         
            
            work._dirty = true
        }
    },

    onScroll: function(engine, ctx) {
        const carousel = engine.entities.carousel
        // carousel.offset[1] = engine.scrollY
        carousel._dirty = true
    },

    onDeactivate: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        const parent = engine.entities[entity.parent]

        console.warn('deactivating', entity.id)
        if(parent && parent.carousel ) {
           
            // gsap.killTweensOf(entity)
            // gsap.to(entity, {opacity: 0, autoAlpha: 1, duration: 1, ease: 'expo2.inOut', onUpdate: () => {entity._dirty = true}})
        }
    },

    onActivate: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        const parent = engine.entities[entity.parent]
        if(entity.carousel) {
            entity.startTime = ctx.timestamp
        }

        

        if(parent && parent.carousel ) {
           

            if(parent.selected) {
                engine.deactivate(parent.selected)
                parent.selected.opacity = 0    
            }
        
            parent.selected = entity.id

            gsap.killTweensOf(entity)
            // gsap.set(entity, {opacity: 0, autoAlpha: 1})
            gsap.to(entity, {opacity: 1, autoAlpha: 1, duration: 1, ease: 'expo2.inOut', onUpdate: () => {entity._dirty = true}})

        }
    },

    onSelectWorks: function(engine, ctx) {
        const carousel = engine.entities.carousel
        
        carousel.works = ctx.works
       

        carousel.startTime = ctx.timestamp
        // if(carousel.selected) {
        //     engine.deactivate(carousel.selected)
        // }
        
        engine.activate(carousel.id)

        

        this.onResize(engine, ctx)
    },
    
    onUpdate: function(engine, ctx) {
        const timestamp = ctx.timestamp 
        const carousel = engine.entities.carousel

        const elapsed = timestamp - carousel.startTime
        const ticks = Math.floor(elapsed / carousel.tempo)
        
        // Find all active parents that have works (locations)
        // const works = Object.values(engine.entities).filter(e => e.enabled && e.work && e.parent === 'carousel')

        const works = carousel.works.map(w => engine.entities[w])
        
  

        if(works.length > 0) {


            const activeIndex = Math.round(engine.progress * (works.length - 1))
            const work = works[activeIndex]
            
            

        
            if(work && work.id !== carousel.selected) {
                
                engine.activate(work.id)

                
                
            }
            
      
            
        }

       

        
    }
}