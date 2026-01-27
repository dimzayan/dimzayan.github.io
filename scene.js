const sceneSystem = {

    offset: 400,
    tempo : 5000,

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

        for(const child of scene.children) {
            engine.enable(child)
            // engine.activate(view)
            const childEntity = engine.entities[child]
            childEntity.parent = scene.id
            

        }



    },

    onMount: function(engine, ctx) {
      
        const {entity, container} = ctx.data;
        const works = Object.values(engine.entities).filter(entity => entity.work)


        
        

        if(entity && entity.parent && entity.parent === 'baseScene') {
            container.classList.add('section')

   

   
            let onUpdate = () => {}
            let end = window.innerHeight;
            if(entity.works) {

                const carouselElement = document.createElement('div')
                carouselElement.classList.add('carousel')
                container.appendChild(carouselElement)

                
                entity.works.forEach(workId => {
                    const work = engine.entities[workId]
                    if(!work) {
                        console.error('work not found', workId)
                        return
                    }
                    const workContainer = engine.mount(work);
                    carouselElement.appendChild(workContainer);
          
                })

                onUpdate = (self) => {
                    const progress = self.progress.toFixed(2)
                    
                    const activeIndex = Math.round(progress * (entity.works.length - 1));
                    const activeWork = entity.works[activeIndex]
                    
                    if(activeWork !== entity.activeWork) {
                        console.log(` selecting: ${Math.round(progress * entity.works.length)}/${entity.works.length}`);
                        if(entity.activeWork) {
                            console.log('deactivating', entity.activeWork)
                            engine.deactivate(entity.activeWork)
                            gsap.killTweensOf(`#${entity.activeWork}`)
                            gsap.to(`#${entity.activeWork}`, {opacity: 0, zIndex: 0, duration: 1, ease: 'expo2.inOut', onUpdate: () => {entity._dirty = true}})
                        }
                        console.log('activating', activeWork)
                        engine.activate(activeWork)
                        gsap.killTweensOf(`#${activeWork}`)
                        gsap.to(`#${activeWork}`, {opacity: 1, zIndex: 10, duration: 1, ease: 'expo2.inOut', onUpdate: () => {entity._dirty = true}})
                        entity.activeWork = activeWork
                    }
                }

                end = entity.works.length * window.innerHeight
            }
        


            const trigger = container.querySelector('.content')

           
        
            ScrollTrigger.create({
                trigger: container,
                start: 'top center',
                end: `bottom center`,
                scrub: 2,
                
                onToggle: (self) => {
                    if(self.isActive) {
                        this.activeSectionId = entity.id;
                    }
                    console.log( entity.id, self.isActive)
                },
                // onUpdate: onUpdate
            })

            
      
        }
        // gsap.set(`#${carousel.id}`, {left: this.offset})
        // gsap.set(`#${menu.id}`, {left: 0, width: this.offset})

        if(!entity.scene) {
            return
        }

        let smoother = ScrollSmoother.create({
            wrapper: '#baseScene',
            content: '#baseScene > .wrapper',
            smooth: 1,
            lag: 0.5,
            effects: true,
            touch: {
                smooth: 1,
                touchMultiplier: 1
            }
        });

        smoother.effects('.content', {lag: 0.1, smooth: 1})
        smoother.effects('.carousel', {lag: 0.2, smooth: 2})


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


    onClick: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]

        if(!ctx.data) { return }

        if(ctx.data.action  && this[ctx.data.action]) {
            this[ctx.data.action](engine, ctx.data)
        }

      
       
    },
    

    onUpdate: function(engine, ctx) {
       

        const activeSection = engine.entities[this.activeSectionId];

        if(!activeSection) { return }

        const media = activeSection.works;

        if(!media || media.length === 0) { return }


        const activeIndex = Math.floor((ctx.timestamp/ this.tempo) % (media.length ));
      
        const activeMedia = media[activeIndex];

        console.log('activeMedia', activeMedia)
        
        if(activeMedia !== activeSection.activeMedia) {

            console.log('activating', activeMedia)
            
            if(activeSection.activeMedia) {
                engine.deactivate(activeSection.activeMedia)
                gsap.killTweensOf(`#${activeSection.activeMedia}`)
                gsap.to(`#${activeSection.activeMedia}`, {opacity: 0, zIndex: 0, duration: 1, ease: 'expo2.inOut'})
            }
            
            engine.activate(activeMedia)
            gsap.killTweensOf(`#${activeMedia}`)
            gsap.to(`#${activeMedia}`, {opacity: 1, zIndex: 10, duration: 1, ease: 'expo2.inOut'})
            activeSection.activeMedia = activeMedia
        }
    
   

    },

    selectProject: function(engine, ctx) {
        const {entity: projectId} = ctx;
        const project = engine.entities[projectId]
        if(project) {
            
            engine.activate(project.id)
            document.querySelector('#selected_projects .wrapper').appendChild(engine.mount(project))
            document.querySelector(`#${project.id}`).classList.add('project')
            gsap.from(`#${project.id}`, {opacity: 0, duration: 1, ease: 'expo3.inOut'})
        }

        // gsap.to('#selected_projects > .wrapper > .content', { opacity: 0, duration: 0.3, ease: 'expo3.inOut'})
    },
}
