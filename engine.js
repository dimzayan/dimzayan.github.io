
let events = []
const engine = {
    entities: {},
    processes: {},
    archetypes: {},
    events: [],
    mode: 'desktop',
    timelines: {},
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
            return
        }
        entity.active = true
        entity._dirty = true

        console.warn('activating', entity.id)
        events.push({id: 'onActivate', entity: entity.id})

    },

    deactivate: function(entityId) {
        const entity = this.entities[entityId]
        if(entity.active) {
            entity.active = false
            entity._dirty = true
            entity.opacity = 0
            events.push({id: 'onDeactivate', entity: entity.id})
        }
    },

    enable: function(entityId) {
        const entity = this.entities[entityId]
        if(!entity.enabled) {
            entity.enabled = true
            entity._dirty = true
            entity.opacity = 1
        }
    },

    disable: function(entityId) {
        const entity = this.entities[entityId]
        if(entity.enabled) {
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
        works.forEach(work => {
            if(work[data.filter] && work[data.filter] === data.value) {
                work.enabled = true;
                work._dirty = true;
            } else {
                work.enabled = false;
                work._dirty = true;
            }
        })
        events.push({id: 'onSelectWorks', filter: data.filter})
    },
    mount: function(entity) {
        const entityContainer = document.createElement('div');
        entityContainer.id = entity.id;
        entityContainer.classList.add('entity');

        this.timelines[entity.id] = gsap.timeline();


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
            wrapper.appendChild(entityTitle);
        }

        
        
        if(entity.image) {
            const entityImage = document.createElement('img');
            entityImage.loading = 'lazy';
            entityImage.src = entity.image;
            entityImage.alt = entity.title || '';


            // For carousel works, set specific size
            if(entity._inCarousel) {
                entityImage.style.width = '400px';
                entityImage.style.height = '500px';
                entityImage.style.objectFit = 'contain'; // Don't crop landscape images
            } else {
                entityImage.style.width = '100%';
            }
            wrapper.appendChild(entityImage);
        }

        if(entity.text) {
            const entityText = document.createElement('div')
            entityText.classList.add('text')
            entityText.innerText = entity.text;
            wrapper.appendChild(entityText);

        }

        if(entity.clickable) {
            entityContainer.dataset.clickable = true;
        }
        
    
    
        entityContainer.style.position = 'fixed';
   
        
    
        document.body.appendChild(entityContainer);
        return entityContainer;
    },
    render: function(entity) {
       

        let entityContainer = document.querySelector(`#${entity.id}`);   
        if(!entityContainer) {
           entityContainer = this.mount(entity)
        }

        // Handle carousel works - position them at carousel location
        let renderX = entity.position[0];
        let renderY = entity.position[1];
        let renderWidth = entity.size[0];
        let renderHeight = entity.size[1];
        // Default opacity: active = 1, inactive = 0.8 (for menu items)
        // let renderOpacity = entity.opacity || 1;
  
        

   
        console.warn(entity.id, entity.opacity)
  

        gsap.killTweensOf(entityContainer);
     
        gsap.to(entityContainer, {
            x: renderX,
            y: renderY,
            width: renderWidth,
            height: renderHeight,
            opacity: entity.opacity ,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'expo.inOut',
            onComplete: () => {

                engine.queueEvent('onAnimationComplete', {entity: entity.id})
                // console.log(entityContainer.id, entityContainer.getBoundingClientRect())
            }
        });

        // entityContainer.style.transform = `translate(${entity.position[0]}px, ${entity.position[1]}px)`;
        // entityContainer.style.width = `${entity.size[0]}px`;
        // entityContainer.style.height = `${entity.size[1]}px`;
        entityContainer.style.padding = `${padding}px`;


        entityContainer.dataset.active = entity.active? entity.active : false
        entityContainer.dataset.enabled = entity.enabled? entity.enabled : false

        if(entity.fontSize) {
            entityContainer.style.fontSize = entity.fontSize + 'em'
        }
    },

    update: (timestamp) => {
        engine.events.push({id:'onUpdate', timestamp: timestamp})
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
    },

    run: function(timestamp) {
        this.events.push(...events)
        events = []
        
        this.update(timestamp);
        requestAnimationFrame(this.run.bind(this));
    }
}
