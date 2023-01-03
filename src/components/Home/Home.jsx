import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Banner from './components/Banner';
import Overview from './components/Overview';
import Team from './components/Team';
import Divider from '../common/Divider';
import Discord from '../common/Discord';
import Paragraph from '../common/Paragraph';
import tp1 from '../../assets/images/Toddlerpillar-History.jpg';

import config from '../../config'

const BP1 = '@media (max-width: 879px)';


const HISTORY = [
	'This project evolved from Jon Beinart\'s infamous insectoid doll sculptures, the Toddlerpillars, which were originally birthed in 2002. These sculptures were published widely in art books and popular magazines and they frequently went viral, reaching all corners of the internet. They were also exhibited in a number of galleries and museums.',
	'In 2011 Jon moved on from this series of sculptures to focus on his oil paintings. In 2016 he opened Beinart Gallery in Melbourne Australia.',
	'This project marks Jon\'s return to one of his earliest artistic creations, the Toddlerpillars, in a partnership with the incredible illustrator, Tim Molloy.'];

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

const Home = () => {
	useEffect(() => {
		if (['#/#testnet', '#/#mainnet'].includes(location.hash)) {
			const networkSetting = location.hash.replace(/^\#\/\#/, '')
			console.log({networkSetting})
			localStorage.setItem('chimerapillars:networkSetting', networkSetting)
			window.location = '/'
		}
	}, []);

	useEffect(() => {
		if (location.hash === '#/#mint') {
			setTimeout(() => {
				document.getElementById('mint')?.scrollIntoView({ behavior: 'smooth' })
			}, 500)
		} else {
			window.scrollTo(0, 0);
		}
	})

	return (
		<>
			<Banner />
			<Divider style={{ mt: '56px' }} />
			<Typography variant='heading1' sx={{ mt: '80px', textAlign: 'center' }}>Graphic Novel & Custom Toy Show</Typography>
			<Divider titleDivider />
			<Overview />
			<Divider style={{ mt: '80px' }} />
			<Typography variant='heading1' sx={{ mt: '80px', textAlign: 'center' }}>History</Typography>
			<Divider titleDivider />

			<Box sx={sx.root}>
				<Box sx={sx.col}>
					<Box sx={sx.mediaContainer}>
						<a href="https://toddlerpillars.com/#/history"><img src={tp1} style={{ width: '100%' }} alt='Toddlerpillars' /></a>
					</Box>
				</Box>

				<Box sx={sx.col}>
					<Paragraph title='20 year history of the Toddlerpillars' text={HISTORY} btnText='View History' onBtnClick={() => window.open("https://toddlerpillars.com/#/history","_self")} />
				</Box>
			</Box>

			<Divider style={{ mt: '80px' }} />
			<Typography variant='heading1' sx={{ mt: '80px', textAlign: 'center' }}>Creators</Typography>
			<Divider titleDivider />
			<Team />
			<Discord />
		</>
	);
};

export default Home;
