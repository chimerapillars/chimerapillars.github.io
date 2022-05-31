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
          BUTTONS: ['Toddlerpillars', 'About', 'Roadmap', 'Mythology', 'History', 'Rarity'],
          MOBILEBUTTONS: ['Toddlerpillars', 'About', 'Roadmap', 'Mythology', 'History', 'Rarity'],
          PATHS: [null, 'https://toddlerpillars.com/#/about', 'https://toddlerpillars.com/#/mythology', 'https://toddlerpillars.com/#/history', 'https://toddlerpillars.com/#/roadmap'],
          DROPMENU: [],
          DROPMENUPATHS: [],
          // BUTTONS: ['Toddlerpillars', 'About', 'Roadmap', 'OpenSea'],
          // MOBILEBUTTONS: ['Toddlerpillars', 'About', 'Roadmap', 'OpenSea'],
          // PATHS: [null, '/about', '/roadmap', null],
          // DROPMENU: ['About Toddlerpillars', 'Mythology', 'History'],
          // DROPMENUPATHS: ['/about', '/mythology', '/history'],
     },
     socials: {
          twitter: {
               url: 'https://twitter.com/chimerapillars',
          },
          discord: {
               url: 'https://discord.gg/toddlerpillars',
          },
     },
}

export default config
