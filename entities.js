const entities = {


    baseScene : {
        scene : true,
        enabled: true,
        view: ['menu', 'carousel'],
       
        padding: {
            top: 0,
            bottom: 0
        },

        
        
        transformable: true,
        _displayable: true
    },

    menu: {
        list: true,
        parent: 'baseScene',
        transformable: true,
        _displayable: true,
        padding: 10,
        offset: [0,100],
        itemSize: [400,50],
        active: true
    },

    carousel : {

        carousel: true,
        transformable: true,
        _displayable: true,
        tempo: 6000,
        offset: [500,200],
        itemSize: [400,500],
        size: [400,500]
    },

    ether : {
        ether: true,
        transformable: false
        
    },
    
    // exhibition1: {
    //     title: "MarfaMust Group show",
    //     text: `MarfaMust Group show in Marfa, Texas`,
       
    //     link: "https://www.google.com",
    //     location: 1,
    //     year: 2025,
    //     transformable: true,
    //     _exhibition: true,
    // }, 
    // exhibition2: {
    //     title: "Lannan Park",
    //     text: "Group show in Marfa, Texas",
       
    //     link: "https://www.google.com",
    //     location: 1,
    //     year: 2024,
    //     transformable: true,
    //     _exhibition: true,
    // },
    // exhibition3: {
    //     title: "Avant Galerie Vossen",
    //     text: "Group show in Paris, France",
      
    //     link: "https://www.google.com",
    //     location: 2,
    //     year: 2023,
    //     transformable: true,
    //     _exhibition: true,
    // },
    // exhibition4: {
    //     title: "DYOR",
    //     text: "Group show in Zürich, Switzerland",
       
    //     link: "https://www.google.com",
    //     location: 4,
    //     year: 2022,
    //     transformable: true,
    //     _exhibition: true,
    //     _displayable: true
    // },
    // exhibition5: {
    //     title: "NFT NYC",
    //     text: "Group show in New York City, New York",
        
    //     link: "https://www.google.com",
    //     location: 3,
    //     year: 2023,
    //     transformable: true,
    //     _exhibition: true,
    //     _displayable: true
    // },
    // exhibition6: {
    //     title: "Fake Miami",
    //     text: "Group show in Miami, Florida",
        
    //     link: "https://www.google.com",
    //     location: 5,
    //     year: 2022,
    //     transformable: true,
    //     _exhibition: true,
    //     _displayable: true,
    //     parent: 'exhibitions'
    // },
    // exhibition7: {
    //     title: "Bitcoin Conf",
    //     text: "Group show in Miami, Florida",
        
    //     link: "https://www.google.com",
    //     location: 5,
    //     year: 2021,
    //     transformable: true,
    //     _exhibition: true,
    //     _displayable: true,
    //     parent: 'exhibitions'
    // },
    // exhibition8: {
    //     title: "Art in Dumbo",
    //     text: "Group show in Brooklyn, New York",
       
    //     link: "https://www.google.com",
    //     location: 3,
    //     year: 2017,
    //     transformable: true,
    //     _exhibition: true,
    //     _displayable: true,
    //     clickable: true,
    //     parent: 'exhibitions'
    // },

    hero: {
        title: 'Dim Zayan'   
    },

    press1: {
        title: "MarfaMUST highlights local artists with directory, special showings this week",
        link: "https://bigbendsentinel.com/2024/05/08/marfamust-highlights-local-artists-with-directory-special-showings-this-week/",
        year: 2024,
        _press: true,
        transformable: true,
        _displayable: true,
        clickable: true,
        parent: 'press'
    },
    press2: {
        title: "Interview with Daniel Prince on 21ism",
        link: "https://21ism.com/portfolio-item/dim-zayan/",
        year: 2021,
        _press: true,
        transformable: true,
        _displayable: true
    },
    press3: {
        title: "The Voicepaper on 21ism",
        link: "https://21ism.com/portfolio-item/bitcoin-voice-paper/",
        year: 2021,
        _press: true,
        transformable: true,
        _displayable: true
    },
    press4: {
        title: "Interview with BitBuyBit",
        link: "https://www.bit-buy-bit.com/podcast-1/episode/3646dca8/ep73-the-evolutionary-path-with-dim-zayan/",
        year: 2021,
        _press: true,
        transformable: true,
        _displayable: true
    },
    press5: {   
        title: "BTC TIMES: The Community Effort That Gives a Voice to the Bitcoin White Paper",
        link: "https://www.btctimes.com/news/the-community-effort-that-gives-a-voice-to-the-bitcoin-white-paper/",
        year: 2021,
        _press: true,
        transformable: true,
        _displayable: true
    },
    press6: {
        title: "BTCTKVR: Why The Voicepaper Project Is Bitcoin's Immune System",
        link: "https://bitcoin-takeover.com/why-the-voicepaper-project-is-bitcoins-immune-system/",
        year: 2021,
        _press: true,
        transformable: true,
        _displayable: true
    },
    press7: {
        title: "Interview with Nico/ BitVolt",
        link: "https://www.youtube.com/watch?v=yMTphrVaE6I&t=11s/",
        year: 2020,
        _press: true,
        transformable: true,
        _displayable: true
    },

    work1: {
        title: "Rarevision",
        description: "Description of work 1",
        image: "https://cdn.dimzayan.com/dim/Fgp4cjcXwAMPfRh%20(1).jpeg",
        link: "https://xchain.io/art/rarevision",
        location: 'location4',
        year: 2025,
        work: true,
        _digital: true,
        _physical: true,
        _video: true,
        transformable: true,
        _displayable: true
    },

    selfandvoid: {
        title: "Self and Void",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_3601.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true
    },

    timeandwilderness: {
        title: "Time and Wilderness",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_3685.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true
    },

    spacetime: {
        title: "Spacetime",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_5356.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true,
        featured: true
    },

    sundial_001: {
        title: "Sundial 001",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_6676.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true,
        featured: true
    },

    sundial_002: {
        title: "Sundial 002",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_6667.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true
    },

    sundial_003: {
        title: "Sundial 003",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_6704.webp",
        location: 'location1',
        year: 2024,
        work: true,
        _physical: true,
        transformable: true,
        _displayable: true
    },

    sundial_004: {
        title: "Sundial 004",
        description: "Oil on gypsum, 2024",
        image: "https://cdn.dimzayan.com/works/IMG_6688.webp",
        location: 'location1',
        year: 2024,
        work: true, 
        _physical: true,
        transformable: true,
        _displayable: true
    },

    work2: {
        title: "Work 2",
        description: "Description of work 2",
        image: "https://cdn.dimzayan.com/dim/FeZveoFWQAkpH23.jpeg",
        link: "https://xchain.io/art/raredream",
        location: 'location4',
        year: 2024,
        work: true,
        transformable: true,
        _displayable: true
    },
    work3: {
        title: "Pepeplebz",
        description: "Description of work 3",
        image: "https://cdn.dimzayan.com/PEPEPLEBZ.gif",
        link: "https://www.google.com",
        location: 'location5',
        year: 2023,
        work: true,
        transformable: true,
        _displayable: true
    },

    work6: {
        title: "Pepebro",
        description: "Description of work 6",
        image: "https://xchain.io/img/cards/PEPEBRO.jpg",
     
        location: 'location5',
        year: 2020,
        work: true,
        transformable: true,
        _displayable: true
    },

    work7: {
        title: "Rarevision Fakerare",
        description: "Description of work 7",
        image: "https://cdn.dimzayan.com/rv/gif/RAREVISION.gif",
        link: "https://xchain.io/art/rarevision",
        location: 'location5',
        year: 2021,
        work: true,
        transformable: true,
        _displayable: true
    },

    work8: {
        title: "Ritual Spiritis",
        description: "Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/ritual.spiritis.jpg",
        link: "https://www.google.com",
        location: 'location3',
        year: 2018,
        work: true,
        transformable: true,
        _displayable: true
    },

    work9: {
        title: "Ritual Exorcism",
        description: "Exorcism, Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.exorcism.jpg",
        link: "https://www.google.com",
        location: 'location3',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    work10: {
        title: "Ritual Dog and Elephant",
        description: "Dog and Elephant, Oil on canvas, 2019",
        image: "https://cdn.dimzayan.com/dim/ritual.elephant.dog.jpg",
        link: "https://www.google.com",
        location: 'location3',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    work11: {
        title: "Ritual Beast",
        description: "Beast, Oil on wood panel, 2017",
        image: "https://cdn.dimzayan.com/dim/ritual.beast.jpg",
        link: "https://www.google.com",
        location: 'location3',
        year: 2017,
        work: true,
        transformable: true,
        _displayable: true
    },

    work12: {
        title: "Ritual City",
        description: "Oil and Latex on Canvas, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.city.jpg",
        link: "https://www.google.com",
        location: 'location3',
        year: 2018,
        work: true,
        transformable: true,
        _displayable: true
    },

    work13: {
        title: "Elephant Road, part II",
        description: "Shamans, Oil and oil sticks and hardboard, 2019",
        image: "https://dimzayan.nyc3.digitaloceanspaces.com/dim/elephantroad.part2.48x30.2016.png",
        link: "https://www.google.com",
        location: 'location3',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    work14: {
        title: "Ritual Swimmers",
        description: "Swimmers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sea.jpg",
        link: "https://www.google.com",
        location: 'location2',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    work15: {
        title: "Ritual Sun Worshippers",
        description: "Sun Worshippers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sun.jpg",
        link: "https://www.google.com",
        location: 'location2',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    work16: {
        title: "Elephant Road",
        description: "Acrylic on canvas, 48x30in, 2016",
        image: "https://cdn.dimzayan.com/dim/elephantroad.part1.48x30.2016.png",
        link: "https://www.google.com",
        location: 'location3',
        year: 2016,
        work: true,
        transformable: true,
        _displayable: true
    },

    work17: {
        title: "Sweet Potatoes on Sunday",
        description: "Acrylic on canvas, 30x48in, 2016",
        image: "https://cdn.dimzayan.com/dim/sweetpotatoesonsunday.30x48.2016.png",
        link: "https://www.google.com",
        location: 'location3',
        year: 2016,
        work: true,
        transformable: true,
        _displayable: true
    },
 
    work19: {
        title: "Vessel One",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.One.jpg",
        link: "https://www.google.com",
        location: 'location3',
       
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    work20: {
        title: "Vessel Two",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.two.gif",
        link: "https://www.google.com",
        location: 'location3',
       
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    work21: {
        title: "Vessel Three",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.Three.jpg",
        link: "https://www.google.com",
        location: 'location3',
   
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    work22: {
        title: "Portal",
        description: "",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
    
        location: 'location1',
        year: 2025,
        work: true,
        transformable: true,
        _displayable: true
    },
    work23: {
        title: "Self and Void",
        description: "oil and acrylic on gypsum",
        image: "https://cdn.dimzayan.com/works/lennan.park.2024.png",
        location: 'location1',
        year: 2024,
        work: true,
        transformable: true,
        _displayable: true
    },



    
    bio: {
        title: "Dim Zayan",
        text: `Born in France in 1977, Dim Zayan is a multidisciplinary artist based in Marfa, Texas.

        His work investigates contradictions inherent in contemporary experience, bridging subcultures through explorations of science, nature, spirituality, and technology.`,
        year: 2026,
        transformable: true,
        _displayable: true,
        offset: [0,0],
        clickable: true,
        parent: 'menu',
        active: true,
        opacity: 1,
        onSelect: {command: 'selectWorks', filter: 'featured', value: true}
      
    },



    location1: {
        title: "Far West Texas",
        text: `Dim moved to Marfa in 2023 and from that point departed from his previous techniques and started working with construction materials as the subject matter. 
        
        Since it became home to Donald Judd, Marfa is internationally recognised for its unique artistic ecosystem at the edge of the desert the exhibition engages with the town's tradition of radical art, experimentation, and reflection`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location1'}
    },

    // step3: {
    //     title: "East Coast",
    //     text: ``Trained in Art and Design in Paris, `
    //     parent: 'menu',
    //     _location: true,
    //     transformable: true,
    //     _displayable: true,
    //     link: true,
    //     clickable: true,
    //     onSelect: {command: 'selectWorks', filter: 'location', value: 'location1'}
    // },

    location2: {
        title: "East Coast",
        text: `<p>in 1999, Dim relocated to New York City. His work as a graphic designer and engineer opened the way to a new perception and led him to explore and intergrate a set of new media and the creative process into his work.</p>
        
       
        <p>The relationship between the human and its environment is a central theme of his work. It is a reflection of the human condition and the relationship between the human and the natural world.</p>`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location3'}
    },
    location4: {
        title: "Paris",
       
        text: `<p>Dim grew up in Paris, France where he studied art, design and economics.</p><p>self-taught in computer science, he started programming games at 12 years old and developped culutal influences that spanned from comics like Moebius, film Kurosawa and the punk  heavy metal rap trip hop scene. Klimt, Dali, Carravagio, Klee</p> `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location2'}
    },
    
    location3: {
        title: "Zürich",
        parent: 'menu',
        text: `<p>Curated by Nina Roehrs at the Kunsthalle Zürich in 2022, <a href="https://dyor.kunsthallezurich.ch/" target="_blank">DYOR</a> was an exhibition that focused on artists, projects and platforms that have had a significant influence on how the crypto art scene has developed and is today.</p><br/>
        <p>Dim was invited to show Rarevision, a physical work with a live real-time rendering of transactions of the Bitcoin Network.</p>`,
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location4'}
    },
    location5: {
        title: "Miami",
        text: `Dim's involvement with NFT was focused on Bitcoin promise and revolutionary concepts.  In 2021, a man named Craig Wright who falsely pretended to be the inventor of Bitcoin tried to claim intellectual property over Bitcoin's whitepaper and started suing everyone who hosted a copy of it online. As a response, Dim asked 131 people from the space to recite a section from the whitepaper. The result was this collaborative video to show that Bitcoin is a community based currency that belongs to everyone and that nobody can claim ownership over it. In parallel, that statement also underlined the broad diversity in backgrounds, origins, aspirations of the community and that the meaning of the “Vires in Numeris” motto is contextually as computational as it is human. `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location5'}
    },
    location6: {
        title: "Connecticut",
        text: `Talk about: 
        BUlltardia
        INspiration through the woods
        Bitcoin 
        `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        onSelect: {command: 'selectWorks', filter: 'location', value: 'location6'}
    },
    
    exhibitions: {
        link: true,
        clickable: true,
        title: 'Exhibitions',
        text: `<dl>   
        <dd>MarfaMust Group show, 2025, Marfa</dd>
        <dd>Lannan Park, 2024, Marfa</dd>
        <dd>Pepefest, 2023, Avant Galerie, Paris</dd>
        <dd>DYOR, 2022, Kunsthalle Zürich, Zürich</dd>
        <dd>NFT NYC 2022, New York City</dd>
        <dd>Fake Miami 2022, Miami</dd>
        <dd>Bitcoin Conf 2021, Miami</dd>
        <dd>Art in Dumbo 2017, Brooklyn</dd>
        </dl>`,
     
        transformable: true,
        _displayable: true,
        parent: 'menu',
        padding: 10
    },

    press: {
        link: true,
        clickable: true,
        title: 'Press',
        text: `<dl>
        <dd><a target="_blank" href="https://bigbendsentinel.com/2024/05/08/marfamust-highlights-local-artists-with-directory-special-showings-this-week/">MarfaMust article on Big Bend Sentinel, 2024</a></dd>
        <dd><a target="_blank" href="https://21ism.com/portfolio-item/dim-zayan/">Interview with Daniel Prince on 21ism, 2021</a></dd>
			<dd><a target="_blank" href="https://21ism.com/portfolio-item/bitcoin-voice-paper/">The Voicepaper on 21ism, 2021</a></dd>
			<dd><a target="_blank" href="https://www.bit-buy-bit.com/podcast-1/episode/3646dca8/ep73-the-evolutionary-path-with-dim-zayan/">Interview with BitBuyBit, 2021</a></dd>
			
			<dd><a target="_blank" href="https://www.btctimes.com/news/the-community-effort-that-gives-a-voice-to-the-bitcoin-white-paper">BTC TIMES: The Community Effort That Gives a Voice to the Bitcoin White Paper, 2021</a></dd>
			<dd><a target="_blank" href="https://bitcoin-takeover.com/why-the-voicepaper-project-is-bitcoins-immune-system/">BTCTKVR: Why The Voicepaper Project Is Bitcoin’s Immune System, 2021</a></dd>
			<dd><a target="_blank" href="https://www.youtube.com/watch?v=yMTphrVaE6I&amp;t=11s/">Interview with Nico/ BitVolt, 2020</a></dd>
        </dl>`,
        command: 'onActivate',
        commandValue: 'press',
        transformable: true,
        _displayable: true,
        parent: 'menu'
    },
    contact: {
        title: 'Contact',
        text: `<p>Dim Zayan</p>
        <p>208 W El Paso Street #2, 
        <p>Marfa, Texas 79843
        <p>USA</p>

        <p>dim.marfa.studio@gmail.com</p>
        +1 6.4.6.6.7.8.1.4.6.8

        <br/>
        Instagram: <a href="https://www.instagram.com/dimzayan/">@dimzayan</a>
        
        `,
     
        command: 'onActivate',
        commandValue: 'contact',
        transformable: true,
        _displayable: true,
        clickable: true,
        parent: 'menu'
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


    
}