// Deps.
import logo from '../assets/images/Chimerapillars-Logo.png';

// Project config.
const config = {
     id: 'chimerapillars',
     name: 'Chimerapillars',
     slug: 'chimerapillars',
     logo,
     colors: {
          background: '#000',
          text: '#ffffff',
          primary: '#c2c0fd',
          highlight: '#545284',
     },
     nav: {
          BUTTONS: [
            'Toddlerpillars',
            'About',
            // 'Mythology',
            // 'History',
            // 'Rarity',
            // 'Merge & Burn',
            'Graphic Novel',
            'Vinyl Toys',
            'Digital Collectables'
          ],
          MOBILEBUTTONS: [
            'Toddlerpillars',
            'About',
            // 'Mythology',
            // 'History',
            // 'Rarity',
            // 'Merge & Burn',
            'Graphic Novel',
            'Vinyl Toys',
            'Digital Collectables'
          ],
          PATHS: [
            null,
            'https://toddlerpillars.com/about',
            'https://toddlerpillars.com/graphic-novel',
            'https://toddlerpillars.com/custom-toys',
            // 'https://toddlerpillars.com/#/mythology',
            // 'https://toddlerpillars.com/#/history',
            null
          ],
          DROPMENU: [
            'About Toddlerpillars',
            'Roadmap',
            'History',
          ],
          DROPMENUPATHS: [
            'https://toddlerpillars.com/about',
            'https://toddlerpillars.com/roadmap',
            'https://toddlerpillars.com/history',
          ],
     },
     socials: {
          twitter: {
               url: 'https://twitter.com/chimerapillars',
          },
          discord: {
               url: 'https://discord.gg/pillars',
          },
     },
     mergeburn: {
       apiRoot: 'https://chimerapillars.herokuapp.com/api',
     },
}

export default config
