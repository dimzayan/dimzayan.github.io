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

            
    
            if(entity.works) {
                entity.index = 0;
                const carouselElement = document.createElement('div')
                carouselElement.classList.add('carousel')
                container.appendChild(carouselElement)

                const nav = document.createElement('nav')
                nav.classList.add('nav')
                carouselElement.appendChild(nav)


                entity.works.forEach((workId, index) => {
                    const work = engine.entities[workId]
                    if(!work) {
                        console.error('work not found', workId)
                        return
                    }
                    const workContainer = engine.mount(work);
                    carouselElement.appendChild(workContainer);

                    

                    if(entity.works.length > 1) {
                        const a = document.createElement('a')
                        a.dataset.work = workId
                        a.dataset.index = index;
                        a.dataset.clickable = true
                        a.dataset.action = 'selectWork'
                        a.dataset.entity = workId
                      

                        nav.appendChild(a)
                    }
                 
                    
          
                })

            }
        
            ScrollTrigger.create({
                trigger: container,
                start: 'top center',
                end: `bottom center`,
                scrub: 2,
                
                onToggle: (self) => {
                    if(self.isActive) {
                        this.activeSectionId = entity.id;
                        this.startTime = engine.timestamp;
                       
                        this.selectWork(engine, {force: true})
                    }
                },
                // onUpdate: onUpdate
            })
        }

        if(!entity.scene) {
            return
        }

        

            let smoother = ScrollSmoother.create({
                wrapper: '#baseScene',
                content: '#baseScene > .wrapper',
                smooth: engine.mode !== 'mobile' ? 1 : 0,
                lag: engine.mode !== 'mobile' ? 1 : 0,
                effects: true,
                normalizeScroll: true,
                touch: {
                    smooth: 1,
                    touchMultiplier: 1
                }
            });

            if(engine.mode !== 'mobile') {
                smoother.effects('.content', {lag: 0.1, smooth: 1})
                smoother.effects('.carousel', {lag: 0.2, smooth: 2})
            }
        

        

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
          
            console.log('onClick', ctx.data.action)
            this[ctx.data.action](engine, ctx.data)
        }


        
      
       
    },
    
    // nextWork: function(engine, ctx) {
    //     const activeSection = engine.entities[this.activeSectionId];
    //     if(!activeSection) { return }
    //     const media = activeSection.works;
    //     if(!media || media.length === 0) { return }
    //     const activeIndex = Math.floor((ctx.timestamp/ this.tempo) % (media.length ));
    //     const activeMedia = media[activeIndex];
    //     engine.activate(activeMedia)
    // },

    onWorkOut: function(engine, ctx) {

        console.log('onWorkOut', engine.timestamp)

        // this.startTime = engine.timestamp ;
    },


    onUpdate: function(engine, ctx) {

        if(engine.workHover) {
            return
        }
       

        const activeSection = engine.entities[this.activeSectionId];

        if(!activeSection) { return }

        const media = activeSection.works;

        if(!media || media.length === 0) { return }


        if(ctx.timestamp < (this.startTime + this.tempo)) {
            return
        }

        
      
        this.selectWork(engine, {index: (activeSection.index + 1) % media.length})
    
   

    },


    selectWork: function(engine, ctx) {

        

        let {index, force} = ctx; 

        
        
        const activeSection = engine.entities[this.activeSectionId];
        
        const sectionContainer = document.querySelector(`#${activeSection.id} .carousel`);
        index = index !== undefined ? index : activeSection.index;

        if(!activeSection.works || activeSection.works.length === 0) { return }
        if(index !== activeSection.index || force) {
            this.startTime = engine.timestamp;

            let activeMedia = activeSection.works[activeSection.index];
            engine.deactivate(activeMedia)

            if(sectionContainer) {
                if(sectionContainer.querySelector('nav a.active')) {
                    sectionContainer.querySelector('nav a.active').classList.remove('active')
                }
            }
            gsap.killTweensOf(`#${activeMedia}`)
            gsap.to(`#${activeMedia}`, {opacity: 0, zIndex: 0, duration: 1, ease: 'expo2.inOut'})
            
            
            activeSection.index = index;
            activeMedia = activeSection.works[activeSection.index];
            engine.activate(activeMedia)
            
            if(sectionContainer) {
                if(sectionContainer.querySelector('nav a[data-index="' + index + '"]')) {  
                    sectionContainer.querySelector('nav a[data-index="' + index + '"]').classList.add('active')
                
                }
            }
            gsap.killTweensOf(`#${activeMedia}`)
            gsap.to(`#${activeMedia}`, {opacity: 1, zIndex: 10, duration: 1, ease: 'expo2.inOut'})
            
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
