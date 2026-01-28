const entities = {


    baseScene : {
        scene : true,
        enabled: true,
        children: ['bio', 'far_west_texas', 'east_coast', 'zurich', 'paris',  'selected_projects','exhibitions', 'press', 'contact'],
       
        padding: {
            top: 0,
            bottom: 0
        },        
        transformable: true,
        _displayable: true
    },

    dyor_kunsthalle_zurich_002: {
        title: "Rarevision",
        description: "displayed at DYOR, Kunsthalle Zürich, 2023",
        image: "https://cdn.dimzayan.com/dim/Fgp4cjcXwAMPfRh%20(1).jpeg",
        link: "https://xchain.io/art/rarevision",
        location: 'zurich',
        year: 2023,
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
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
        location: 'far_west_texas',
        year: 2024,
        work: true, 
        _physical: true,
        transformable: true,
        _displayable: true
    },

    dyor_kunsthalle_zurich_001: {
        title: "DYOR",
        description: "DYOR, Kunsthalle Zürich, 2023",
        image: "https://cdn.dimzayan.com/dim/FeZveoFWQAkpH23.jpeg",
        link: "https://xchain.io/art/raredream",
        location: 'zurich',
        year: 2023,
        work: true,
        transformable: true,
        _displayable: true
    },
    pepeplebz: {
        title: "Pepeplebz",
        description: "Description of work 3",
        image: "https://cdn.dimzayan.com/PEPEPLEBZ.gif",
        link: "https://www.google.com",
        location: 'miami',
        year: 2023,
        work: true,
        transformable: true,
        _displayable: true
    },

    pepebro: {
        title: "Pepebro",
        description: "Description of work 6",
        image: "https://xchain.io/img/cards/PEPEBRO.jpg",
     
        location: 'miami',
        year: 2020,
        work: true,
        transformable: true,
        _displayable: true
    },

    voicepaper: {
        title: "The Bitcoin Voicepaper",
        description: "The Bitcoin Voicepaper, 2021",
        // image: "https://cdn.dimzayan.com/voicepaper.gif",
        video: "https://www.youtube.com/embed/7jldYncbU6s?si=ppTzqQBP-HAfbK1p",

        location: 'miami',
        year: 2021,
        work: true,
        transformable: true,
        _displayable: true
    },

    rarevision_fakerare: {
        title: "Rarevision Fakerare",
        description: "Description of work 7",
        image: "https://cdn.dimzayan.com/rv/gif/RAREVISION.gif",
        link: "https://xchain.io/art/rarevision",
        location: 'miami',
        year: 2021,
        work: true,
        transformable: true,
        _displayable: true
    },

    spiritis: {
        title: "Ritual Spiritis",
        description: "Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/ritual.spiritis.jpg",

        location: 'east_coast',
        year: 2018,
        work: true,
        transformable: true,
        _displayable: true
    },

    exorcism: {
        title: "Ritual Exorcism",
        description: "Exorcism, Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.exorcism.jpg",
  
        location: 'east_coast',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    dog_and_elephant: {
        title: "Dog and Elephant",
        description: "Oil on canvas, 2019",
        image: "https://cdn.dimzayan.com/dim/ritual.elephant.dog.jpg",
  
        location: 'east_coast',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    beast: {
        title: "Beast",
        description: "Oil on wood panel, 2017",
        image: "https://cdn.dimzayan.com/dim/ritual.beast.jpg",
        link: "https://www.google.com",
        location: 'east_coast',
        year: 2017,
        work: true,
        transformable: true,
        _displayable: true
    },

    ritual_city: {
        title: "City",
        description: "Oil and Latex on Canvas, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.city.jpg",

        location: 'east_coast',
        year: 2018,
        work: true,
        transformable: true,
        _displayable: true
    },

    elephant_road_2: {
        title: "Elephant Road, part II",
        description: "Oil and oil sticks and hardboard, 2019",
        image: "https://dimzayan.nyc3.digitaloceanspaces.com/dim/elephantroad.part2.48x30.2016.png",

        location: 'east_coast',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    swimmers: {
        title: "Swimmers",
        description: "Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sea.jpg",

        location: 'paris',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    sun_worshippers: {
        title: "Sun Worshippers",
        description: "Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sun.jpg",

        location: 'paris',
        year: 2019,
        work: true,
        transformable: true,
        _displayable: true
    },

    elephant_road_1: {
        title: "Elephant Road",
        description: "Acrylic on canvas, 48x30in, 2016",
        image: "https://cdn.dimzayan.com/dim/elephantroad.part1.48x30.2016.png",
        link: "https://www.google.com",
        location: 'east_coast',
        year: 2016,
        work: true,
        transformable: true,
        _displayable: true
    },

 
    lighbox_001: {
        title: "Vessel One",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.One.jpg",
   
        location: 'east_coast',
       
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    lighbox_003: {
        title: "Vessel Two",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.two.gif",

        location: 'east_coast',
       
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    lighbox_002: {
        title: "Vessel Three",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.Three.jpg",

        location: 'east_coast',
   
        year: 2015,
        work: true,
        transformable: true,
        _displayable: true
    },
    // work22: {
    //     title: "Portal",
    //     description: "",
    //     image: "https://cdn.dimzayan.com/works/dim.hero.png",
    
    //     location: 'far_west_texas',
    //     year: 2025,
    //     work: true,
    //     transformable: true,
    //     _displayable: true
    // },
    man_and_dog: {
        title: "Man and dog",
        description: "oil and acrylic on gypsum",
        image: "https://cdn.dimzayan.com/works/lennan.park.2024.png",
        location: 'far_west_texas',
        year: 2024,
        work: true,
        transformable: true,
        _displayable: true
    },

    rarevision: {
        title: "Rarevision",
        text: `<p>Rarevision is at the same time a collection of digital assets, a software and a physical installation. Using a collection of animations carefully composed by Dim on Counterparty, the algorithm renders a live interpretation of the transactions happening on the Bitcoin network in real time. Other factors such as the price fluctuation or volume of transactions affect the representation, making the final result a perpetual live stream of digital assets dancing to the rhythm of the new economy. In 2022, Dim was invited to show Rarevision at the Kunsthalle in Zürich during one of the first show by a major institution about historical NFTs.</p>`,
        media: ["rarevision_fakerare", "dyor_kunsthalle_zurich_001"],
        isProject: true,
        transformable: true,
        _displayable: true
    },

    sol_001: {
        title: "Seed of Light 001",
        description: "Generative, Javascript, 2021",
        image: "https://cdn.dimzayan.com/works/IMG_8816.webp",
        location: 'east_coast',
        year: 2021,
        work: true,
        _physical: false,
        _digital: true,
        transformable: true,
        _displayable: true
    },


    selected_projects: {
        title: "Selected Projects",
        showTitle: true,
        text: `<dl>
        <dd>Sundials</dd>
        <dd>Bodies of Water</dd>
        <dd><a data-action="selectProject" data-entity="rarevision" >Rarevision</a></dd>
        <dd><a data-action="selectProject" data-entity="voicepaper" >The Bitcoin Voicepaper</a></dd>
        <dd><a data-action="selectProject" data-entity="bulltardia" >Bulltardia</a></dd>
        <dd><a data-action="selectProject" data-entity="plebs" >Plebs</a></dd>
        
        </dl>`,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
    },



    
    bio: {
        title: "About",
        text: `<p>Dim Zayan (b. 1977, France) is a multidisciplinary artist working across painting, digital
media, installation, and narrative structures.</p><p>His practice draws from expressionist traditions
and contemporary digital culture. Zayan's work has been presented in international group
exhibitions including Kunsthalle Zürich, NFT.NYC, and Pepefest in Paris.</p><p>He lives and works in
Marfa, Texas.</p>`,
        year: 2026,
        transformable: true,
        _displayable: true,
        offset: [0,0],
        clickable: true,
        parent: 'baseScene',
        active: true,
        opacity: 1,
        onSelect: {command: 'selectWorks', filter: 'featured', value: true}
      
    },



    far_west_texas: {
        title: "Far West Texas",
        text: `<p>Since moving to Marfa in 2023, Zayan's work has been evolving into a dialogue with the landscape. The hard shadows across the rugged terrain, the flat wide open horizon, and the massive blue skies inform his approach to light and surface. The desert becomes a playground for experimentation with space and perception through outdoor installations and reliefs reminiscent of the surrounding landscape.</p> <p>His recent work uses construction materials as a primary medium. By sanding, carving, and painting raw gypsum board, he exposes the material's layered structure—textures and forms akin to eroded mineral surfaces.</p><p>Zayan applies similar techniques to depict sea structures. These bodies of water aren't rendered for contrast with the desert, but to suggest connection: a plateau as an ancient seabed, a geological memory still present in the stone and soil.</p>`,
        parent: 'baseScene',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        works: ['selfandvoid', 'timeandwilderness',  'sundial_001', 'sundial_002', 'sundial_003', 'sundial_004','man_and_dog'],
        onSelect: {command: 'selectWorks', filter: 'location', value: 'far_west_texas'}
    },


    east_coast: {
        title: "East Coast",
        text: `<p>In 1999, Zayan relocated to New York City, where he worked as a graphic designer and engineer. This experience enabled him to expand his artistic practice into digital media and multidisciplinary formats.</p><p>Materials such as electronics, LEDs, and plastics are selected not arbitrarily, but for their capacity to convey specific emotional or psychological states.</p><p>For instance, in his lightboxes, precisely layered sheets of plastic and metal—combined with software-controlled LED sequences—are used to deconstruct beams of light into a pixelated rendering. </p>`,
        parent: 'baseScene',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        works: ['sol_001', 'lighbox_001', 'lighbox_002']
    },
    zurich: {
        title: "Zürich",
        parent: 'menu',
        text: `<p>In 2022, Dim Zayan was invited to show Rarevision at the Kunsthalle Zürich.</p>
        <p>Rarevision, a live and real-time rendering of transactions on the Bitcoin Network, was presented at <a href="https://dyor.kunsthallezurich.ch/" target="_blank">DYOR</a>, an exhibition curated by Nina Roehrs that focused on artists, projects and platforms that have had a significant influence on how the crypto art scene has developed and is today.</p>`,
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        works: ['dyor_kunsthalle_zurich_001','dyor_kunsthalle_zurich_002', 'rarevision_fakerare'],
        onSelect: {command: 'selectWorks', filter: 'location', value: 'paris'}
    },

    paris: {
        title: "Paris",
       
        text: `<p>Dim Zayan grew up in Paris, France where he studied art, design and economics.Self-taught in computer science, he began programming games in Basic, viewing coding as a creative practice.</p><p> Through his studies and upbringing, he was exposed to a broad range of cultural influences that spanned across genres and mediums.  Key artistic early inspirations include Carravagio, Doig, Jarmusch, Klee, Klimt, Kundera, Kurosawa, Moebius, Otomo and Paik.</p> `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        works: ['spiritis','exorcism','dog_and_elephant','beast','ritual_city','elephant_road_2','swimmers','sun_worshippers'],
        onSelect: {command: 'selectWorks', filter: 'location', value: 'east_coast'}
    },
    

    digital_art: {
        title: "Bitcoin and digital art",
        text: `<p>Dim's involvement with NFT was focused on Bitcoin promise and revolutionary concepts.</p>
        <p>In 2021, a man named Craig Wright who falsely pretended to be the inventor of Bitcoin tried to claim intellectual property over Bitcoin's whitepaper and started suing everyone who hosted a copy of it online. As a response, Dim asked 131 people from the space to recite a section from the whitepaper. The result was this collaborative video to show that Bitcoin is a community based currency that belongs to everyone and that nobody can claim ownership over it. In parallel, that statement also underlined the broad diversity in backgrounds, origins, aspirations of the community and that the meaning of the “Vires in Numeris” motto is contextually as computational as it is human.</p> `,
        parent: 'menu',
        _location: true,
        transformable: true,
        _displayable: true,
        link: true,
        clickable: true,
        works: ['voicepaper', 'pepeplebz', 'pepebro'],
        onSelect: {command: 'selectWorks', filter: 'location', value: 'miami'}
    },

    exhibitions: {
        link: true,
        clickable: true,
        showTitle: true,
        title: 'Exhibitions',
        text: `<dl>  
        <dd>A three-quarter view of the future, 2026, Do Right Hall, Marfa (upcoming)</dd> 
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
        showTitle: true,
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
        showTitle: true,
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
     
        works: ['spacetime'],
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