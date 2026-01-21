const entities = {
    
    exhibition1: {
        title: "MarfaMust Group show",
        description: "Group show in Marfa, Texas",
       
        link: "https://www.google.com",
        location: 1,
        year: 2025,
        transformable: true,
        _exhibition: true,
    }, 
    exhibition2: {
        title: "Lannan Park",
        description: "Group show in Marfa, Texas",
       
        link: "https://www.google.com",
        location: 1,
        year: 2024,
        transformable: true,
        _exhibition: true,
    },
    exhibition3: {
        title: "Avant Galerie Vossen",
        description: "Group show in Paris, France",
      
        link: "https://www.google.com",
        location: 2,
        year: 2023,
        transformable: true,
        _exhibition: true,
    },
    exhibition4: {
        title: "DYOR",
        description: "Group show in Zürich, Switzerland",
       
        link: "https://www.google.com",
        location: 4,
        year: 2022,
        transformable: true,
        _exhibition: true,
        _displayable: true
    },
    exhibition5: {
        title: "NFT NYC",
        description: "Group show in New York City, New York",
        
        link: "https://www.google.com",
        location: 3,
        year: 2023,
        transformable: true,
        _exhibition: true,
        _displayable: true
    },
    exhibition6: {
        title: "Fake Miami",
        description: "Group show in Miami, Florida",
        
        link: "https://www.google.com",
        location: 5,
        year: 2022,
        transformable: true,
        _exhibition: true,
        _displayable: true,
        parent: 'exhibitions'
    },
    exhibition7: {
        title: "Bitcoin Conf",
        description: "Group show in Miami, Florida",
        
        link: "https://www.google.com",
        location: 5,
        year: 2021,
        transformable: true,
        _exhibition: true,
        _displayable: true,
        parent: 'exhibitions'
    },
    exhibition8: {
        title: "Art in Dumbo",
        description: "Group show in Brooklyn, New York",
       
        link: "https://www.google.com",
        location: 3,
        year: 2017,
        transformable: true,
        _exhibition: true,
        _displayable: true,
        parent: 'exhibitions'
    },

    hero: {
        title: 'Dim Zayan'   
    },

   

    work1: {
        title: "Rarevision",
        description: "Description of work 1",
        image: "https://cdn.dimzayan.com/dim/Fgp4cjcXwAMPfRh%20(1).jpeg",
        link: "https://www.google.com",
        location: 4,
        year: 2025,
        _work: true,
        _digital: true,
        _physical: true,
        _video: true,
        transformable: true,
        _displayable: true
    },
 
 
    work2: {
        title: "Work 2",
        description: "Description of work 2",
        image: "https://cdn.dimzayan.com/dim/FeZveoFWQAkpH23.jpeg",
        link: "https://www.google.com",
        location: 2,
        year: 2024,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work3: {
        title: "Pepeplebz",
        description: "Description of work 3",
        image: "https://cdn.dimzayan.com/PEPEPLEBZ.gif",
        link: "https://www.google.com",
        location: 3,
        year: 2023,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work4: {
        title: "Pepeliotta",
        description: "Description of work 4",
        image: "https://cdn.dimzayan.com/PEPELIOTTA.gif",
        link: "https://www.google.com",
        location: 1,
        year: 2022,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work5: {
        title: "Pepeniro",
        description: "Description of work 5",
        image: "https://cdn.dimzayan.com/PEPENIRO.gif",
        link: "https://www.google.com",
        location: 2,
        year: 2021,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work6: {
        title: "Pepebro",
        description: "Description of work 6",
        image: "https://xchain.io/img/cards/PEPEBRO.jpg",
        link: "https://www.google.com",
        location: 3,
        year: 2020,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work7: {
        title: "Rarevision Fakerare",
        description: "Description of work 7",
        image: "https://cdn.dimzayan.com/rv/gif/RAREVISION.gif",
        link: "https://www.google.com",
        location: 1,
        year: 2021,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work8: {
        title: "Ritual Spiritis",
        description: "Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/ritual.spiritis.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2018,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work9: {
        title: "Ritual Exorcism",
        description: "Exorcism, Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.exorcism.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work10: {
        title: "Ritual Dog and Elephant",
        description: "Dog and Elephant, Oil on canvas, 2019",
        image: "https://cdn.dimzayan.com/dim/ritual.elephant.dog.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2019,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work11: {
        title: "Ritual Beast",
        description: "Beast, Oil on wood panel, 2017",
        image: "https://cdn.dimzayan.com/dim/ritual.beast.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2017,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work12: {
        title: "Ritual City",
        description: "Oil and Latex on Canvas, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.city.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2018,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work13: {
        title: "Elephant Road, part II",
        description: "Shamans, Oil and oil sticks and hardboard, 2019",
        image: "https://dimzayan.nyc3.digitaloceanspaces.com/dim/elephantroad.part2.48x30.2016.png",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work14: {
        title: "Ritual Swimmers",
        description: "Swimmers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sea.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work15: {
        title: "Ritual Sun Worshippers",
        description: "Sun Worshippers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sun.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work16: {
        title: "Elephant Road",
        description: "Acrylic on canvas, 48x30in, 2016",
        image: "https://cdn.dimzayan.com/dim/elephantroad.part1.48x30.2016.png",
        link: "https://www.google.com",
        location: 4,
        year: 2016,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work17: {
        title: "Sweet Potatoes on Sunday",
        description: "Acrylic on canvas, 30x48in, 2016",
        image: "https://cdn.dimzayan.com/dim/sweetpotatoesonsunday.30x48.2016.png",
        link: "https://www.google.com",
        location: 4,
        year: 2016,
        _work: true,
        transformable: true,
        _displayable: true
    },
 
    work19: {
        title: "Vessel One",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.One.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work20: {
        title: "Vessel Two",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.two.gif",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true,
        transformable: true,
        _displayable: true
    },
    work21: {
        title: "Vessel Three",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.Three.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true,
        transformable: true,
        _displayable: true
    },
    works : {
        _grid: true,
        filters: ['_displayable',  'year'],
        sortBy: 'year',
        columns: 1,
        padding: 12,
        width: 1000,
        enabled: false
    },
    // exhibitions : {
    //     _grid: true,
    //     enabled: false,
    //     filters: ['_displayable', '_exhibition'],
    //     sortBy: 'year',
    //     columns: 1,
    //     padding: 10,
    //     width: 400,

    // },

    press : {
        _grid: true,
        enabled: false,
        filters: ['_displayable', '_press'],
        sortBy: 'year',
        columns: 1,
        padding: 10,
        width: 400,
    },
    baseScene : {
        scene : true,
        enabled: true,
        view: ['menu']
    },

    bio: {
        title: "Dim Zayan",
        text: `Born in France in 1977, Dim Zayan is a multidisciplinary artist based in Marfa, Texas.

        Trained in Art and Design in Paris, he relocated to New York City where he began integrating digital media with traditional artistic practices. His work investigates contradictions inherent in contemporary experience, bridging subcultures through explorations of science, nature, spirituality, and technology.`,
        year: 2026,
        transformable: true,
        _displayable: true,
        offset: [0,0],
        size: [300,300],
        clickable: true,
        parent: 'menu',
        active: true
      
    },

    location1: {
        title: "Marfa",
        text: `Dim moved to Marfa in 2023. His studio is located in front of Sentinel: 
        208 W El Paso St #2, Marfa 79843`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true
    },
    location3: {
        title: "New York City",
        text: `Dim spent nearly twenty years in New York, spending his time between his home in Manhattan and his studio in Dumbo. During that time he familiarized with traditional materials and well getting familiarized with new media, engineering and computer science.  `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },
    location2: {
        title: "Paris",
       
        text: `Dim grew up in Paris, France where he studied graphic design and economics.`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },
    
    location4: {
        title: "Zürich",
        parent: 'menu',
        text: `In 2020, Dim got invited to participate to one of the first group retroscpective around NFTs. DYOR at the Kunsthalle `,
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },
    location5: {
        title: "Miami",
        text: `Bleh`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },
    location6: {
        title: "Connecticut",
        text: `Bleh`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },
    
    exhibitions: {
        link: true,
        clickable: true,
        title: 'Exhibitions',
        text: 'Exhibitions',
        command: 'onActivate',
        commandValue: 'exhibitions',
        transformable: true,
        _displayable: true,
        parent: 'menu',
        padding: 10,
        size: [100,50]
    },

    press_link: {
        link: true,
        clickable: true,
        title: 'Press',
        text: 'Press',
        command: 'onActivate',
        commandValue: 'press',
        transformable: true,
        _displayable: true,
        parent: 'menu',
        size: [100,50]
    },
    
    // year_2025: {
        
    //     link: true,
    //     clickable: true,
    //     title: '2025',
    //     text: '2025',
    //     command: 'onActivate',
    //     commandValue: 'works',
    //     transformable: true,
    //     _displayable: true,
    //     parent: 'menu',
    //     size: [100,50]

    // },
    // year_2024: {
    //     link: true,
    //     clickable: true,
    //     title: '2024',
    //     text: '2024',
    //     command: 'onActivate',
    //     commandValue: 'works',
    //     transformable: true,
    //     _displayable: true,
    //     parent: 'menu',
    //     size: [100,50]

    // },
    // year_2023: {
    //     link: true,
    //     clickable: true,
    //     title: '2023',
    //     text: '2023',
    //     command: 'onActivate',
    //     commandValue: 'works',
    //     transformable: true,
    //     _displayable: true,
    //     parent: 'menu',
    //     size: [100,50]

    // },

    menu: {
        list: true,
        parent: 'baseScene',
        transformable: true,
        _displayable: true,
        padding: 10,
        offset: [100,100],
        itemSize: [200,50],
        active: true
    },

    contact: {
        title: 'Contact',
        text: `Dim Zayan
        dim.marfa.studio@gmail.com
        +1 646 six seven eight 1468
        208 W El Paso St #2, Marfa 79843
        instagram.com/dimzayan`,
        command: 'onActivate',
        commandValue: 'contact',
        transformable: true,
        _displayable: true,
        parent: 'menu'
    },
}

const listSystem = {
    onInit: (engine, ctx) => {
        const index = 0;
        const offset = [0,0];
        for(const list of Object.values(engine.entities).filter(entity => entity.list)) {
          
            for(const child of Object.values(engine.entities).filter(entity => entity.parent === list.id)) {
                
                child.offset = [offset[0], offset[1]];
                child._dirty = true;
                child.size = child.size || [...list.itemSize]
            
                offset[1] += child.size[1] + list.padding;
            }
           
            list._dirty = true
        }
    },
    onUpdate: (engine, ctx) => {
        
    }
}

const parentSystem = {
    onUpdate: (engine, ctx) => {
        for(const entity of Object.values(engine.entities).filter(e => e.parent )) {
            const parent = engine.entities[entity.parent]
            if(parent.enabled && !entity.enabled) {
                entity.enabled = true;
                
                entity._dirty = true;
            }

            if(!parent.active) {
                entity._displayable = false
            } else {
                entity._displayable = true
               
            }
        }
    }
}

const clickableSystem = {
    onUpdate: function(engine) {
        
    },

    onClick: function(engine, ctx) {
        const entity = engine.entities[ctx.entity]
        if(entity.clickable) {
            events.push({id: 'onActivate', entity: entity.id})
        }
    }
}


const menuItemSystem = {
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
        entity.size[0] = 300
        entity.active = true
        for(const child of children) {
           

            child.offset = [offset[0], offset[1]];
            
            


            if(child.id !== entity.id) {
                child.active = false
                child.size[1] = 50
                
            } 

            offset[1] += child.size[1] + parent.padding;
           
            console.log(child.id, entity.id, offset[1], child.size[1], entity.size[1])
            child._dirty = true
    
          
            
        }

        
        
        
        console.log(entity.id, entity.size)
        
        
    }
}

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

const sceneSystem = {
    onInit: function() {
        
    },

    onUpdate: function(engine) {
        for(const scene of Object.values(engine.entities).filter(entity => entity.scene && entity.enabled)) {
            for(const view of scene.view) {
                
                const entity = engine.entities[view];
                
                if(entity && entity._displayable) {
                    entity.enabled = true;
                    entity._dirty = true

                }
            }
        }
    }
}

const gridSystem = {
  
    components: {},
    
    onInit: function(engine, ctx) {
        // engine.archetypes.grid = []
        for(const entity of Object.values(engine.entities).filter(entity => entity._grid )) {
            
            for(const [key, value] of Object.entries(this.components)) {
                entity[key] = {...value, ...entity[key]};
                
            }
            entity.width = window.innerWidth * 0.8
            entity.height = 0

            // engine.archetypes.grid.push(entity.id)
            
        }
    },
    onUpdate: function(engine, ctx) {
        for(const grid of Object.values(engine.entities).filter(entity => entity._grid && entity.enabled)) {
            let x = 0;
            let y = 0;
            let index = 0;
            let offset = [
                (window.innerWidth - grid.width) / 2,
                (window.innerHeight - grid.height) / 2
            ]

           
            let cellWidth = (grid.width / grid.columns)
            let colIndex = 0;
            let rowIndex = 0;
            let columnHeights = []


           
            for(const entity of Object.values(engine.entities).filter(entity => grid.filters.every(key => entity[key])).sort((a, b) => b[grid.sortBy] - a[grid.sortBy])) {
                
                if(!entity.enabled) {
                    entity.enabled = true
                    entity._dirty = true
                }
                
                x =  cellWidth * colIndex + offset[0];
                columnHeights[colIndex] = columnHeights[colIndex] || 0;
        
                
                y = columnHeights[colIndex] + offset[1];
                // entity.position.x = x;

                columnHeights[colIndex] += entity.size[1] + grid.padding;
                colIndex =  (colIndex + Math.ceil(entity.size[0] / cellWidth)) 
                
                if(colIndex >= grid.columns ) {
                    colIndex = 0;
                    rowIndex ++;
                }
             
                
                index ++;
            }

            grid.height = y

        }

    }
}





const transformableSystem = {
    components: {
        position: [0,0],
        size: [300,100]
    },
    onInit: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(entity => entity.transformable)) {
            for(const [key, value] of Object.entries(this.components)) {
                entity.size = entity.size || [300, 100]
                entity.position  = entity.position || [0,0]
                entity._dirty = true
            }
        }
    },
    onUpdate: function(engine, ctx) {
        const transformableEntities = Object.values(engine.entities).filter(entity => entity.transformable && entity.enabled)

        for(const entity of transformableEntities) {
            let index = 0;
            let offset = entity.offset || [0,0]
            let x = offset[0]
            let y = offset[1]

            if(entity.parent) { 
                let parent = entity.parent ? engine.entities[entity.parent] : null;
                if(parent.position) {
                    x += parent.position[0] 
                    y += parent.position[1]
                    // x = parent.position[0] + entity.position[0]
                    // y = parent.position[1] + entity.position[1]
                }
            }
            // let x = parent && parent.transformable ? Number(parent.position[0]) + Number(entity.position[0]) : Number(entity.position[0]);
            // let y = parent && parent.transformable ? Number(parent.position[1]) + Number(entity.position[1]) : Number(entity.position[1]);
            


            
           

            
            if(entity.position[0] !== x) {
                console.log(entity.id + ' > '+entity.position[0] + '> '+x)
                entity.position[0] = x;
                entity._dirty = true
            }
            if(entity.position[1] !== y) {
                console.log(entity.id + ' > '+entity.position[1] + '> '+y)
                
                entity.position[1] = y
                entity._dirty = true
            }
     
        }
    }
}



const displayableSystem = {
    
    onInit: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(entity => entity._displayable )) {
            entity._dirty = true;
        }
     
    },
    onUpdate: (engine, ctx) => {
        let index = 0;
        let centerIndex = 0;
        let minDistance = Infinity;
        let centerEntityElement = null;

        
        for(const entity of Object.values(engine.entities).filter(entity => entity._displayable && entity.enabled)) {
    


            if(entity._dirty) {
              
                // console.log(entity)
                engine.render(entity);
                entity._dirty = false
            }
            
      
        }
    }
}
let padding = 12;
let entityWidth = 100;
let mouseDown = false;
let zoom = 0;
let position = {x: 0, y: 0};
let width = 0;
let events = []


const engine = {
    entities: {},
    processes: {},
    archetypes: {},
    events: [],
    mount: (entity) => {
        const entityContainer = document.createElement('div');
        entityContainer.id = entity.id;
        entityContainer.classList.add('entity');
        
       
        if(entity.title) {
            const entityTitle = document.createElement('div')
            entityTitle.classList.add('title')
            entityTitle.innerText = entity.title;
            entityContainer.appendChild(entityTitle);
        }

        
        
        if(entity.image) {
            const entityImage = document.createElement('img');
            entityImage.loading = 'lazy';
            entityImage.src = entity.image;
            entityImage.alt = entity.title;
            entityImage.style.width = '100%';
            entityContainer.appendChild(entityImage);
        }

        if(entity.text) {
            const entityText = document.createElement('div')
            entityText.classList.add('text')
            entityText.innerText = entity.text;
            entityContainer.appendChild(entityText);

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


        console.log(entity.id ,entity.size)

        gsap.to(entityContainer, {
            x: entity.position[0],
            y: entity.position[1],
            width: entity.size[0],
            height: entity.size[1],
            opacity: entity.active ? 1 : 0.8,
          
            duration: 0.3,
            ease: 'expo.inOut'
        })

        // entityContainer.style.transform = `translate(${entity.position[0]}px, ${entity.position[1]}px)`;
        // entityContainer.style.width = `${entity.size[0]}px`;
        // entityContainer.style.height = `${entity.size[1]}px`;
        entityContainer.style.padding = `${padding}px`;


        entityContainer.dataset.active = entity.active? entity.active : false
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
    }
}

const init = () => {

    for(const [key, value] of Object.entries(entities)) {

        engine.entities[key] = {
            ...value,
            id: key
        };
    }
 
    engine.systems = [];
    

    
    
    addSystem(engine, listSystem);
    // addSystem(engine, gridSystem);
    addSystem(engine, sceneSystem);
    addSystem(engine, clickableSystem);
    addSystem(engine, selectableSystem);
    addSystem(engine, menuItemSystem)
    addSystem(engine, parentSystem);
    addSystem(engine, transformableSystem);
    addSystem(engine, displayableSystem);
	const main = document.querySelector('main');
    // renderWorks(main);

    
	requestAnimationFrame(run);
	
}


const run = (timestamp) => {
   
   
    engine.events.push(...events)
    events = []
        
    engine.update(timestamp);
    requestAnimationFrame(run);
}

const addSystem = (engine, system) => {
    engine.systems.push(system);
    system.initialized = false;
    system.onInit = system.onInit || function() {};
}





window.addEventListener('load', () => {

    window.addEventListener('resize', () => {
        
    });

    
    
    document.addEventListener('click', (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const clickableElement = elements.find(el => el.dataset.clickable);
        if(clickableElement) {
            events.push({id: 'onClick', entity: clickableElement.id})
        }
    });
  
  
    
    init();
});
