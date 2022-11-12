import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Paragraph from '../../common/Paragraph';
import tp1 from '../../../assets/images/Toddlerpillar-History.jpg';
import gnovel from '../../../assets/images/Toddlerpillar-Apocalypse-Graphic-Novel.jpg';
import ctoy from '../../../assets/images/Toddlerpillar-Toys.jpg';

const BP1 = '@media (max-width: 879px)';

const sx = {
	root: {
		mt: '40px',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		gap: '40px 40px',
		[BP1]: {
			flexDirection: 'column',
		},
	},
	col: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: '40px',
	},
	mediaContainer: {
		 width: '100%', 
		// aspectRatio: '16 / 9' 
	},
	iframeContainer: {
		overflow: 'hidden',
		paddingTop: "56.25%",
		position: 'relative',
		'& iframe': {
			left: 0,
			top: 0,
			height: '100%',
			width: '100%',
			position: 'absolute',
		},
	},
};

const GRAPHIC_NOVEL = [
	"The Toddlerpillars have escaped their diabolic caretakers to bring about the dawning of a New Age! However, will the corruption of the Lonely 'Pillar spell Doom for humanity? Join the High Priest and his Acolytes as they hasten to save the world from a Surreal Nightmare of Kaiju-sized proportions! Watch reality itself break down, as pocket dimensions open up like inconvenient manholes into even stranger realities.",
	"Ectoplasmic visions, Sentient fungi, evangelical madmen, catatonic killers and psycho-active gland juice abounds in this Psychedelic and Alchemical adventure from the minced brains of artists Christopher Ulrich, Tim Molloy & Jon Beinart."
];

const CUSTOM_TOYS = [
	"Our blank vinyl Toddlerpillar toys are now available from This is Not a Toy Store, for international artists to customise (sculpt & paint) for our huge group exhibition in Melbourne, Australia in mid-2023.",
	"This exhibition will be curated by Jon Beinart (Beinart Gallery owner & Toddlerpillars co-founder) and will feature a host of internationally renowned artists and extraordinary emerging artists from all over the world. The toys were designed by IsmToys and created in collaboration with This is Not a Toy Store.",
	"Order your blank Toddlerpillars for customisation now! Send your submissions to info@toddlerpillars.com."
];

// const MYTHOLOGY = [
// 	'The time has come to usher in the new age of the Toddlerpillars, the lovable descendants of their sculptural ancestors. Tim Molloy has written a hilarious, yet strangely profound backstory for the Toddlerpillars, which finds our little friends in a parallel universe that is set to collide with our own and the evocation of their inter-dimensional cousins, The Chimerapillars.'];



const HISTORY = [
	'This project evolved from Jon Beinart\'s infamous insectoid doll sculptures, the Toddlerpillars, which were originally birthed in 2002. These sculptures were published widely in art books and popular magazines and they frequently went viral, reaching all corners of the internet. They were also exhibited in a number of galleries and museums.',
	'In 2011 Jon moved on from this series of sculptures to focus on his oil paintings. In 2016 he opened Beinart Gallery in Melbourne Australia.',
'This project marks Jon\'s return to one of his earliest artistic creations, the Toddlerpillars, in a partnership with the incredible illustrator, Tim Molloy.'];

const ROADMAP = 'We have exciting things ahead, including our companion collection, the Chimerapillars, exclusive airdrops, a 100+ page multimedia graphic novel exploring our lore, IRL collectable custom toys and physical exhibitions, metaverse exhibitions & much more. ';

const Overview = () => {
	const isSmall = useMediaQuery('(max-width: 879px)');
	const history = useHistory();


	return (
		<Box sx={sx.root}>
			<Box sx={sx.col}>
				<Box sx={sx.mediaContainer}>
					<a href="https://toddlerpillars.com/#/graphic-novel"><img src={gnovel} style={{ width: '100%' }} alt='Graphic Novel' /></a>
				</Box>
				<Paragraph title="Toddlerpillar Apocalpyse Graphic Novel" text={GRAPHIC_NOVEL} btnText="Graphic Novel" onBtnClick={() => window.open("https://toddlerpillars.com/#/graphic-novel","_self")} />
				<Box sx={sx.mediaContainer}>
					<a href="https://toddlerpillars.com/#/custom-toys"><img src={ctoy} style={{ width: '100%'}} alt='Custom Toy' /></a>
				</Box>
				<Paragraph title="Custom Vinyl Toys & Group Exhibition" text={CUSTOM_TOYS} btnText="Custom Vinyl Toys" onBtnClick={() => window.open("https://toddlerpillars.com/#/custom-toys","_self")} />
			</Box>
			<Box sx={sx.col}>
				<Box sx={sx.mediaContainer}>
					<a href="https://toddlerpillars.com/#/history"><img src={tp1} style={{ width: '100%' }} alt='Toddlerpillars' /></a>
				</Box>
				<Paragraph title='20 year history of the Toddlerpillars' text={HISTORY} btnText='View History' onBtnClick={() => window.open("https://toddlerpillars.com/#/history","_self")} />
				{/* <Box sx={sx.mediaContainer}>
					<Box sx={sx.iframeContainer}>
						<iframe
							width='960'
							height='540'
							src='https://www.youtube.com/embed/9cRP0CsQeJI'
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
							title='Embedded youtube'
						/>
					</Box>
				</Box>
				<Paragraph style={{ zIndex: '1' }} title='Toddlerpillar Mythology' text={MYTHOLOGY} btnText='View Mythology' onBtnClick={() => history.push('/mythology')} /> */}
			</Box>
		</Box>
	);
};

export default Overview;
