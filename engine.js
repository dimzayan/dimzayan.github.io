
let events = []
const engine = {
    entities: {},
    processes: {},
    archetypes: {},
    events: [],
    mode: 'desktop',
    timelines: {},
    ticks: 0,
    resize: function() {
        if(window.innerWidth < 800) {
            this.mode = 'mobile'
        } else {
            this.mode = 'desktop'
        }
    },
    init: function(systems) {
       
        
        this.resize()
        for(const [key, value] of Object.entries(entities)) {
    
            engine.entities[key] = {
                ...value,
                id: key
            };
        }
        
        engine.systems = [];
        
    
        for(const system of systems) {
            this.addSystem(system)
        }
        
       
        const main = document.querySelector('main');
      
        
        requestAnimationFrame(this.run.bind(this));
            
        
    },

    queueEvent: function(eventId, data) {
        events.push({id: eventId, data: data})
    },
    activate: function(entityId) {
        const entity = this.entities[entityId]
        if(entity.active) {
            return false
        }
        entity.active = true
        entity._dirty = true
        // entity.opacity = 1

        console.warn('activating', entity.id)
        events.push({id: 'onActivate', entity: entity.id})

        return true
    },

    deactivate: function(entityId) {
        const entity = this.entities[entityId]
        if(!entity.active) {
            return false
        }
            entity.active = false
            entity._dirty = true
            
           
            events.push({id: 'onDeactivate', entity: entity.id})
        
        return true
    },

    enable: function(entityId) {
        const entity = this.entities[entityId]
        if(!entity.enabled) {
            console.warn('>>> enabling', entity.id)
            entity.enabled = true
            entity._dirty = true
            // entity.opacity = 1
        }
    },

    disable: function(entityId) {
        const entity = this.entities[entityId]
        if(entity.enabled) {
            console.warn('<<< disabling', entity.id)
            engine.deactivate(entityId)
            entity.enabled = false
      
            entity._dirty = true
            entity.opacity = 0
        }
    },

    addSystem : function(system) {
        this.systems.push(system);
        system.initialized = false;
        system.onInit = system.onInit || function() {};
    },

    processCommand: function(command) {
        if(command.command) {
            this[command.command](command)
        }
    },
    selectWorks: function(data) {
        console.warn('selecting works', data.filter)
        const works = Object.values(this.entities).filter(entity => entity.work)
        const selectedWorks = []
        works.forEach(work => {
            if(work[data.filter] && work[data.filter] === data.value) {
                engine.enable(work.id)
                
                selectedWorks.push(work.id)
                work._dirty = true;
            } else {
                // engine.disable(work.id)
                
                
            }
        })
        events.push({id: 'onSelectWorks', filter: data.filter, works: selectedWorks})
    },
    mount: function(entity) {
        const entityContainer = document.createElement('div');
        entityContainer.id = entity.id;
        entityContainer.classList.add('entity');

        // this.timelines[entity.id] = gsap.timeline();


        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        entityContainer.appendChild(wrapper);
      
        if(entity.work) {
            entityContainer.classList.add('work');
        }
        
        // For carousel works, hide title
        if(entity.title ) {
            const entityTitle = document.createElement('div')
            entityTitle.classList.add('title')
            entityTitle.innerText = entity.title;
            if(entity.description) {
                entityTitle.innerHTML += `<span class="description">${entity.description}</span>`
            }
            wrapper.appendChild(entityTitle);
        }

        if(entity.image) {
            const entityImage = document.createElement('img');
            entityImage.loading = 'lazy';
            entityImage.src = entity.image;
            entityImage.alt = entity.title || '';
            entityImage.style.width = 'auto';
            wrapper.appendChild(entityImage);
        }

        if(entity.text) {
            const entityText = document.createElement('div')
            entityText.classList.add('text')
            entityText.innerHTML = entity.text;
            wrapper.appendChild(entityText);

        }



        if(entity.scene) {
            // entityContainer.style.position = 'relative';
            // entityContainer.style.height = entity.size[1] + 'px';
            entityContainer.classList.add('scene');
        } else {
            // entityContainer.style.position = 'absolute';
        }

        if(entity.link) {

        }

            const parent = engine.entities[entity.parent]

        if(parent) {
            let parentContainer = document.querySelector(`#${parent.id}`);
            if(parentContainer && !parentContainer.contains(entityContainer)) {
                parentContainer.querySelector('.wrapper').appendChild(entityContainer);
            }   
        } 


        if(entity.carousel) {
            entityContainer.classList.add('carousel');
        }

        document.body.appendChild(entityContainer);

        this.queueEvent('onMount', {entity: entity, container: entityContainer})


        return entityContainer;
    },
    render: function(entity) {
       
        const animation = {
            // opacity: entity.opacity,
            autoAlpha: 1,
            duration: 0.3,
            ease: 'expo2.inOut',
            onUpdate: () => {
                if(entity.scrollTrigger) {
                    entity.scrollTrigger.refresh()
                }
            },
            onComplete: () => {

                // console.log('animation complete', entity.id)

                engine.queueEvent('onAnimationComplete', {entity: entity.id})
                // console.log(entityContainer.id, entityContainer.getBoundingClientRect())
            }
        }

        let entityContainer = document.querySelector(`#${entity.id}`);   
        if(!entityContainer) {
           entityContainer = this.mount(entity)
        }


        const parent = engine.entities[entity.parent]

        if(parent) {
            let parentContainer = document.querySelector(`#${parent.id}`);
            if(parentContainer && !parentContainer.contains(entityContainer)) {
                parentContainer.querySelector('.wrapper').appendChild(entityContainer);
            }   
        } 

        
        // Handle carousel works - position them at carousel location
        // animation.x = entity.position[0];
        // animation.y = entity.position[1];
        // animation.opacity = entity.active ? 1: 0.2 //opacity;
        // animation.padding = padding;

        if(entity.active) {
            entityContainer.dataset.active = entity.active;
            // if(entity.menuItem) {
            //     animation.height = 'auto'
               
            // }
            
            
            
        } else {
            entityContainer.dataset.active = false
            // if(entity.menuItem) {
            //     animation.height = '40px';
            // }
        }
  
     
        // if(entity.menuItem) {
        //     if(!entity.scrollTrigger) {
        //         console.log('creating scrollTrigger for', entity.id);
                

                
        //     }

        //     animation.scale = entity.active ? 1 : 0.7;
        //     // animation.x = entity.active ? '48px' : '-48px';
        //     animation.opacity = entity.active ? 1 : 0.5;
        // }


        if(parent && parent.carousel) {
            // animation.opacity = entity.active ? 1 : 0;
            animation.scale = entity.active ? 1 : 0.9;
            // animation.skewX = entity.active ? 0 : 10;
            // animation.x = entity.active ? '48px' : '-48px';
            animation.duration = 1;
        }

        // gsap.to(entityContainer, animation)

        // gsap.killTweensOf(entityContainer);
     
        // gsap.to(entityContainer, animation);

        if(entity.work) {
            entityContainer.style.visibility = 'visible'
            entityContainer.style.opacity = entity.opacity
        }
    

        
        entityContainer.dataset.enabled = entity.enabled? entity.enabled : false

        if(entity.fontSize) {
            // entityContainer.style.fontSize = entity.fontSize + 'em'
        }
    },

    update: function(timestamp) {
        
       
        engine.events.push({id:'onUpdate', timestamp: timestamp})
        if(this.ticks === 3) {
            // console.log('updating', this.ticks)
            for(const entity of Object.values(engine.entities)) {
                entity._dirty = true;
            }
            this.queueEvent('onMount')
        }
        for(const system of engine.systems) {
            if(!system.initialized) {
               
                system.onInit(engine, timestamp);
                system.initialized = true;
            }

            for(const event of engine.events) {
              
                event.timestamp = timestamp;
                if(system[event.id]) {
                    
                    system[event.id](engine, event)
                }
            }
            
        }
        engine.events = []
        this.ticks ++;
    },

    run: function(timestamp) {
        this.events.push(...events)
        events = []
        
        this.update(timestamp);
        requestAnimationFrame(this.run.bind(this));
    }
}
