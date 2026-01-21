


const parentSystem = {
    onUpdate: (engine, ctx) => {
        for(const entity of Object.values(engine.entities).filter(e => e.parent )) {
            const parent = engine.entities[entity.parent]
            if(parent.enabled && !entity.enabled) {
                entity.enabled = true;
                entity.opacity = 1
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


const sceneSystem = {
    onInit: function(engine, ctx) {
        // Initialize scroll tracking
        engine.scrollY = window.scrollY || window.pageYOffset || 0;
        
        // Create scene container if it doesn't exist
        let sceneContainer = document.getElementById('scene-container');
        if(!sceneContainer) {
            sceneContainer = document.createElement('div');
            sceneContainer.id = 'scene-container';
            sceneContainer.style.position = 'relative';
            sceneContainer.style.width = '100%';
            sceneContainer.style.minHeight = '100vh';
            document.body.appendChild(sceneContainer);
        }
        engine.sceneContainer = sceneContainer;
        
        // Add scroll event listener
        
    },

    onUpdate: function(engine) {
        for(const scene of Object.values(engine.entities).filter(entity => entity.scene && entity.enabled)) {
            // Initialize padding if not set
            if(!scene.padding) {
                scene.padding = { top: 100, bottom: 100 };
            }
            
            for(const view of scene.view) {
                
                const entity = engine.entities[view];
                
                if(entity && entity._displayable) {
                    engine.enable(entity.id)
                    engine.activate(entity.id)
                }
            }
            
            // Check if any entities in this scene have changed size or position
            let needsRecalc = scene._dirty || false;
            if(!needsRecalc) {
                for(const viewId of scene.view) {
                    const viewEntity = engine.entities[viewId];
                    if(viewEntity && viewEntity._dirty) {
                        needsRecalc = true;
                        break;
                    }
                    // Check children
                    const children = Object.values(engine.entities).filter(e => e.parent === viewId);
                    if(children.some(c => c._dirty)) {
                        needsRecalc = true;
                        break;
                    }
                }
            }
            
            // Calculate scene height based on its visible children
            if(needsRecalc) {
                this.calculateSceneHeight(engine, scene);
                scene._dirty = false;
            }
            
            // Update scene container height
            if(scene.height && engine.sceneContainer) {
                const currentHeight = parseInt(engine.sceneContainer.style.height) || 0;
                if(Math.abs(currentHeight - scene.height) > 1) {
                    engine.sceneContainer.style.height = `${scene.height}px`;
                }
            }
        }
    },
    
    calculateSceneHeight: function(engine, scene) {
        const padding = scene.padding || { top: 100, bottom: 100 };
        let maxBottom = 0;
        let hasContent = false;
        
        // Apply top padding to top-level view entities (only once)
        for(const viewId of scene.view) {
            const viewEntity = engine.entities[viewId];
            if(!viewEntity) continue;
            
            // Apply top padding to the view entity's offset if not already applied
            if(!viewEntity._scenePaddingApplied) {
                const originalOffset = viewEntity.offset || [0, 0];
                viewEntity.offset = [originalOffset[0], originalOffset[1] + padding.top];
                viewEntity._scenePaddingApplied = true;
                viewEntity._dirty = true;
            }
        }
        
        // Find all entities that belong to this scene (through view or parent chain)
        for(const viewId of scene.view) {
            const viewEntity = engine.entities[viewId];
            if(!viewEntity || !viewEntity._displayable || !viewEntity.enabled) continue;
            
            // Get all children of this view
            const children = Object.values(engine.entities).filter(e => {
                // Direct children of the view
                if(e.parent === viewId) return true;
                // Or entities that are part of the view's hierarchy
                let current = e;
                while(current && current.parent) {
                    if(current.parent === viewId) return true;
                    current = engine.entities[current.parent];
                    if(!current) break;
                }
                return false;
            });
            
            // Calculate the bottom-most position (using base position, not scroll-adjusted)
            for(const child of children) {
                if(!child._displayable || !child.enabled) continue;
                
                // Use stored base position if available, otherwise calculate it
                let baseY = 0;
                if(child._basePosition) {
                    baseY = child._basePosition[1];
                } else {
                    // Calculate base Y position (before scroll adjustment)
                    baseY = child.offset ? child.offset[1] : 0;
                    if(child.parent) {
                        const parent = engine.entities[child.parent];
                        if(parent) {
                            if(parent._basePosition) {
                                baseY += parent._basePosition[1];
                            } else if(parent.offset) {
                                baseY += parent.offset[1];
                            }
                        }
                    }
                }
                
                const bottom = baseY + (child.size ? child.size[1] : 0);
                if(bottom > maxBottom) {
                    maxBottom = bottom;
                    hasContent = true;
                }
            }
            
            // Also check the view entity itself
            if(viewEntity.size) {
                let baseY = 0;
                if(viewEntity._basePosition) {
                    baseY = viewEntity._basePosition[1];
                } else if(viewEntity.offset) {
                    baseY = viewEntity.offset[1] || 0;
                }
                
                const bottom = baseY + viewEntity.size[1];
                if(bottom > maxBottom) {
                    maxBottom = bottom;
                    hasContent = true;
                }
            }
        }
        
        // Update scene height: content height + bottom padding
        // (top padding is already included in entity positions)
        if(hasContent) {
            const newHeight = maxBottom + padding.bottom;
            if(scene.height !== newHeight) {
                scene.height = newHeight;
                scene._dirty = true;
            }
        } else if(!scene.height) {
            // Default height if no content: viewport height + padding
            scene.height = window.innerHeight + padding.top + padding.bottom;
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
    onScroll: function(engine, ctx) {
        for(const entity of Object.values(engine.entities).filter(e => e._displayable && e.enabled)) {
            entity._dirty = true;
        }
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
                if(parent) {
                    // Use parent's base offset, not scroll-adjusted position
                    const parentOffset = parent.offset || [0, 0];
                    baseX += parentOffset[0];
                    baseY += parentOffset[1];
                }
            }
            
            // Store base position for height calculations
            if(!entity._basePosition) {
                entity._basePosition = [baseX, baseY];
            } else {
                entity._basePosition[0] = baseX;
                entity._basePosition[1] = baseY;
            }
            
            // Account for scroll position - entities with position:fixed need scroll adjustment
            // As user scrolls down, entities should appear to move up in viewport
            const scrollY = engine.scrollY || 0;
            const finalX = baseX;
            const finalY = baseY - scrollY; // Subtract scroll to keep entities in place relative to content

            if(entity.position[0] !== finalX) {
                console.log(entity.id + ' > '+entity.position[0] + '> '+finalX)
                entity.position[0] = finalX;
                entity._dirty = true
            }
            if(entity.position[1] !== finalY) {
                console.log(entity.id + ' > '+entity.position[1] + '> '+finalY)
                entity.position[1] = finalY
                entity._dirty = true
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
    menuSystem,
    clickableSystem,
    selectableSystem,
    // menuItemSystem,
    parentSystem,
    carouselSystem,
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

    window.addEventListener('scroll', () => {
        engine.scrollY = window.scrollY || window.pageYOffset || 0;
        engine.queueEvent('onScroll', {timestamp: Date.now()})
    }, { passive: true });

    
    
    document.addEventListener('click', (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const clickableElement = elements.find(el => el.dataset.clickable);
        if(clickableElement) {
            events.push({id: 'onClick', entity: clickableElement.id})
        }
    });
  
  
    
    engine.init(systems);
});
