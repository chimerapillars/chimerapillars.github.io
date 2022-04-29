// Deps.
import logo from '../assets/images/Toddlerpillars-Logo.png';

// Project config.
const config = {
     id: 'toddlerpillars',
     name: 'Toddlerpillars',
     logo,
     colors: {
          background: '#ffffff',
          text: '#000000',
          primary: '#19A8B4',
          highlight: '#5deffb',
     },
     nav: {
          BUTTONS: ['About', 'Roadmap', 'Hi-res', 'Rarity', 'OpenSea', 'Merch'],
          MOBILEBUTTONS: ['About', 'Roadmap', 'Hi-res', 'Rarity', 'OpenSea', 'Merch'],
          PATHS: ['/about', '/roadmap', '/collections', null, null, null],
          DROPMENU: ['About Toddlerpillars', 'Mythology', 'History'],
          DROPMENUPATHS: ['/about', '/mythology', '/history'],
     },
     socials: {
          instagram: {
               url: 'https://instagram.com/toddlerpillars',
          },
          twitter: {
               url: 'https://twitter.com/toddlerpillars',
          },
          discord: {
               url: 'https://discord.gg/toddlerpillars',
          },
     },
}

export default config
