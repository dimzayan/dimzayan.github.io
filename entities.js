const entities = {
    location1: {
        name: "Marfa, Texas",
        _location: true
    },
    location2: {
        name: "Paris, France",
        _location: true
    },
    location3: {
        name: "New York City, New York",
        _location: true
    },
    location4: {
        name: "Zürich, Switzerland",
        _location: true
    },
    location5: {
        name: "Miami, Florida",
        _location: true
    },
    exhibition1: {
        title: "MarfaMust Group show",
        description: "Group show in Marfa, Texas",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 1,
        year: 2025,
        _exhibition: true,
    }, 
    exhibition2: {
        title: "Lannan Park",
        description: "Group show in Marfa, Texas",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 1,
        year: 2024,
        _exhibition: true,
    },
    exhibition3: {
        title: "Avant Galerie Vossen",
        description: "Group show in Paris, France",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 2,
        year: 2023,
        _exhibition: true,
    },
    exhibition4: {
        title: "DYOR",
        description: "Group show in Zürich, Switzerland",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 4,
        year: 2022,
        _exhibition: true,
    },
    exhibition5: {
        title: "NFT NYC",
        description: "Group show in New York City, New York",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 3,
        year: 2023,
        _exhibition: true,
    },
    exhibition6: {
        title: "Fake Miami",
        description: "Group show in Miami, Florida",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 5,
        year: 2022,
        _exhibition: true,
    },
    exhibition7: {
        title: "Bitcoin Conf",
        description: "Group show in Miami, Florida",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 5,
        year: 2021,
        _exhibition: true,
    },
    exhibition8: {
        title: "Art in Dumbo",
        description: "Group show in Brooklyn, New York",
        image: "https://cdn.dimzayan.com/works/dim.hero.png",
        link: "https://www.google.com",
        location: 3,
        year: 2017,
        _exhibition: true,
    },

    hero: {
        title: 'Dim'   
    },

    bio: {
        text: `Born in France in 1977, Dim Zayan is a multidisciplinary artist
			based in Marfa, Texas. Trained in Art and Design in Paris, he
			relocated to New York City where he began integrating
			digital media with traditional artistic practices. His work
			investigates contradictions inherent in contemporary
			experience, bridging subcultures through explorations of
			science, nature, spirituality, and technology.`
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
    },
 
 
    work2: {
        title: "Work 2",
        description: "Description of work 2",
        image: "https://cdn.dimzayan.com/dim/FeZveoFWQAkpH23.jpeg",
        link: "https://www.google.com",
        location: 2,
        year: 2024,
        _work: true
    },
    work3: {
        title: "Pepeplebz",
        description: "Description of work 3",
        image: "https://cdn.dimzayan.com/PEPEPLEBZ.gif",
        link: "https://www.google.com",
        location: 3,
        year: 2023,
        _work: true
    },
    work4: {
        title: "Pepeliotta",
        description: "Description of work 4",
        image: "https://cdn.dimzayan.com/PEPELIOTTA.gif",
        link: "https://www.google.com",
        location: 1,
        year: 2022,
        _work: true
    },
    work5: {
        title: "Pepeniro",
        description: "Description of work 5",
        image: "https://cdn.dimzayan.com/PEPENIRO.gif",
        link: "https://www.google.com",
        location: 2,
        year: 2021,
        _work: true
    },
    work6: {
        title: "Pepebro",
        description: "Description of work 6",
        image: "https://xchain.io/img/cards/PEPEBRO.jpg",
        link: "https://www.google.com",
        location: 3,
        year: 2020,
        _work: true
    },
    work7: {
        title: "Rarevision Fakerare",
        description: "Description of work 7",
        image: "https://cdn.dimzayan.com/rv/gif/RAREVISION.gif",
        link: "https://www.google.com",
        location: 1,
        year: 2021,
        _work: true
    },
    work8: {
        title: "Ritual Spiritis",
        description: "Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/ritual.spiritis.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2018,
        _work: true
    },
    work9: {
        title: "Ritual Exorcism",
        description: "Exorcism, Oil on wood panel, 4x8ft, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.exorcism.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true
    },
    work10: {
        title: "Ritual Dog and Elephant",
        description: "Dog and Elephant, Oil on canvas, 2019",
        image: "https://cdn.dimzayan.com/dim/ritual.elephant.dog.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2019,
        _work: true
    },
    work11: {
        title: "Ritual Beast",
        description: "Beast, Oil on wood panel, 2017",
        image: "https://cdn.dimzayan.com/dim/ritual.beast.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2017,
        _work: true
    },
    work12: {
        title: "Ritual City",
        description: "Oil and Latex on Canvas, 2018",
        image: "https://cdn.dimzayan.com/dim/rituals.city.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2018,
        _work: true
    },
    work13: {
        title: "Elephant Road, part II",
        description: "Shamans, Oil and oil sticks and hardboard, 2019",
        image: "https://dimzayan.nyc3.digitaloceanspaces.com/dim/elephantroad.part2.48x30.2016.png",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true
    },
    work14: {
        title: "Ritual Swimmers",
        description: "Swimmers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sea.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true
    },
    work15: {
        title: "Ritual Sun Worshippers",
        description: "Sun Worshippers, Oil and oil sticks and hardboard, 2019",
        image: "https://cdn.dimzayan.com/dim/worships.sun.jpg",
        link: "https://www.google.com",
        location: 2,
        year: 2019,
        _work: true
    },
    work16: {
        title: "Elephant Road",
        description: "Acrylic on canvas, 48x30in, 2016",
        image: "https://cdn.dimzayan.com/dim/elephantroad.part1.48x30.2016.png",
        link: "https://www.google.com",
        location: 4,
        year: 2016,
        _work: true
    },
    work17: {
        title: "Sweet Potatoes on Sunday",
        description: "Acrylic on canvas, 30x48in, 2016",
        image: "https://cdn.dimzayan.com/dim/sweetpotatoesonsunday.30x48.2016.png",
        link: "https://www.google.com",
        location: 4,
        year: 2016,
        _work: true
    },
 
    work19: {
        title: "Vessel One",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.One.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true
    },
    work20: {
        title: "Vessel Two",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.two.gif",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true
    },
    work21: {
        title: "Vessel Three",
        description: "Mixed media, 2015",
        image: "https://cdn.dimzayan.com/dim/Vessel.Three.jpg",
        link: "https://www.google.com",
        location: 4,
        year: 2015,
        _work: true
    },
}
