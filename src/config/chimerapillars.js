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
            'Roadmap',
            // 'Mythology',
            // 'History',
            'Rarity',
            'Merge & Burn',
          ],
          MOBILEBUTTONS: [
            'Toddlerpillars',
            'About',
            'Roadmap',
            // 'Mythology',
            // 'History',
            'Rarity',
            'Merge & Burn',
          ],
          PATHS: [
            null,
            'https://toddlerpillars.com/#/about',
            'https://toddlerpillars.com/#/roadmap',
            // 'https://toddlerpillars.com/#/mythology',
            // 'https://toddlerpillars.com/#/history',
            null,
            '/merge',
          ],
          DROPMENU: [
            'About Toddlerpillars',
            'Mythology',
            'History',
          ],
          DROPMENUPATHS: [
            'https://toddlerpillars.com/#/about',
            'https://toddlerpillars.com/#/mythology',
            'https://toddlerpillars.com/#/history',
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
