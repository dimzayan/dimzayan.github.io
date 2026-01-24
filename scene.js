const sceneSystem = {

    offset: 400,

    onSpace: function(engine, ctx) {
        const carousel = engine.entities.carousel
        const menu = engine.entities.menu
        let offset = 0;

  

        if(this.toggle) {
            offset = this.offset
            this.toggle = false;
        } else {
            offset = 0;
            this.toggle = true;
        }


        menu.offset[0] = offset;
        carousel.offset[0] = offset;
        menu._dirty = true;
        carousel._dirty = true;

        gsap.to(`#${menu.id}`, {duration: 0.3, left: offset - this.offset , ease: 'expo2.inOut'})
        gsap.to(`#${carousel.id}`, {duration: 0.4, left: offset, ease: 'expo2.inOut'})

        
    },



    refresh: function(engine, ctx) {

     
    },
    onInit: function(engine, ctx) {
        // Initialize scroll tracking
      
        const scene = engine.entities.baseScene
      
        scene.active = true

        for(const view of scene.view) {
            engine.enable(view)
            engine.activate(view)
        }

        const carousel = engine.entities.carousel
        const menu = engine.entities.menu


        this.refresh(engine, {entity: scene.id})
        
    },

    onMount: function(engine, ctx) {
        console.log('onMount', this.offset)
        gsap.set(`#${carousel.id}`, {left: this.offset})
        gsap.set(`#${menu.id}`, {left: 0, width: this.offset})

    },

    onSelect: function(engine, ctx) {

        
        const entity = engine.entities[ctx.entity]
        const parent = engine.entities[entity.parent]
        if(parent && parent.scene) {
         
            this.refresh(engine, {entity: parent.id})
        }

    },


    onChange: function(engine, ctx) {
    
        const entity = engine.entities[ctx.data.entity]
        const parent = engine.entities[entity.parent]
        if(parent && parent.scene) {
         
            this.refresh(engine, {entity: parent.id})
        }
        
    },

    

    onUpdate: function(engine) {
        
    },

    calculateSceneHeight: function(engine, scene) {
        const padding = scene.padding || { top: 100, bottom: 100 };
        let maxBottom = 0;
        let hasContent = false;
        
        for(const viewId of scene.view) {
            const viewEntity = engine.entities[viewId];
            if(!viewEntity) continue;
        }
    }
}
