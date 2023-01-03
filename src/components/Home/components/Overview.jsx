import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Paragraph from '../../common/Paragraph';
import gnovel from '../../../assets/images/Toddlerpillar-Apocalypse-Graphic-Novel.jpg';
import ctoy from '../../../assets/images/Toddlerpillar-Toys.jpg';

import config from '../../../config'

const BP1 = '@media (max-width: 879px)';

const { colors } = config.PROJECT

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
	"Ectoplasmic visions, Sentient fungi, evangelical madmen, catatonic killers and psycho-active gland juice abounds in this Psychedelic and Alchemical adventure from the minced brains of artists Christopher Ulrich, Tim Molloy & Jon Beinart.",
	() => (
		<>
			<a href="https://toddlerpillars.com/graphic-novel/" target="_blank" style={{
				fontFamily: 'roboto-bold',
				color: colors.primary,
			}}>Join our email list</a> to be notified on the release of Toddlerpillar Apocalypse.
		</>
	),
];

const CUSTOM_TOYS = [
	"Our Toddlerpillar toys are available for artists to customise (sculpt & paint) for two group shows in Melbourne, Australia in Sept 2023. The larger show at Beinart Gallery will feature both world-renowned and extraordinary emerging artists from all over the world, and the second show at This is Not a Toy Store will exhibit stand-out locals from the custom toy scene.",
	"Order your blank Toddlerpillars for customisation now!",
	"Submit images of your customised Toddlerpillars to info@toddlerpillars.com",
	"Join our email list for updates about our custom toy exhibitions & future collectable Toddlerpillar & Chimerapillar toy releases.",
];

// const MYTHOLOGY = [
// 	'The time has come to usher in the new age of the Toddlerpillars, the lovable descendants of their sculptural ancestors. Tim Molloy has written a hilarious, yet strangely profound backstory for the Toddlerpillars, which finds our little friends in a parallel universe that is set to collide with our own and the evocation of their inter-dimensional cousins, The Chimerapillars.'];


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
			</Box>

			<Box sx={sx.col}>
				<Box sx={sx.mediaContainer}>
					<a href="https://toddlerpillars.com/#/custom-toys"><img src={ctoy} style={{ width: '100%'}} alt='Custom Toy' /></a>
				</Box>

				<div>
					<Paragraph title="Custom Vinyl Toys & Group Exhibition" />

					<Typography
						variant='text'
					>
						Our Toddlerpillar toys are available for artists to customise (sculpt & paint) for two group shows in Melbourne, Australia in Sept 2023. The larger show at <a href="https://beinart.org/" target="_blank" style={{
							fontFamily: 'roboto-bold',
							color: colors.primary,
						}}>Beinart Gallery</a> will feature both world-renowned and extraordinary emerging artists from all over the world, and the second show at <a href="https://www.thisisnotatoystore.com/product/toddlerpillar/962" target="_blank" style={{
							fontFamily: 'roboto-bold',
							color: colors.primary,
						}}>This is Not a Toy Store</a> will exhibit stand-out locals from the custom toy scene.
						<br/>
						<br/>
						<a href="https://www.thisisnotatoystore.com/product/toddlerpillar/962" target="_blank" style={{
							fontFamily: 'roboto-bold',
							color: colors.primary,
						}}>Order your blank Toddlerpillars</a> for customisation now!
						<br/>
						<br/>
						Submit images of your customised Toddlerpillars to info@toddlerpillars.com
						<br/>
						<br/>
						<a href="https://toddlerpillars.com/custom-toys/" target="_blank" style={{
							fontFamily: 'roboto-bold',
							color: colors.primary,
						}}>Join our email list</a> for updates about our custom toy exhibitions & future collectable Toddlerpillar & Chimerapillar toy releases.
					</Typography>
					<Paragraph btnText="Custom Vinyl Toys" onBtnClick={() => window.open("https://toddlerpillars.com/#/custom-toys","_self")} />
				</div>
			</Box>
		</Box>
	);
};

export default Overview;
