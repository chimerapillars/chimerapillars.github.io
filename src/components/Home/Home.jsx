import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import Banner from './components/Banner';
import Overview from './components/Overview';
import Team from './components/Team';
import Divider from '../common/Divider';
import Discord from '../common/Discord';

import config from '../../config'

const Home = () => {
	useEffect(() => {
		if (location.hash === '#/#mint') {
			setTimeout(() => {
				document.getElementById('mint')?.scrollIntoView({ behavior: 'smooth' })
			}, 500)
		} else {
			window.scrollTo(0, 0);
		}

		if (['#/#testnet', '#/#mainnet'].includes(location.hash)) {
			const networkSetting = location.hash.replace(/^\#\/\#/, '')
			console.log({networkSetting})
			localStorage.setItem('chimerapillars:networkSetting', networkSetting)
			window.location = '/'
		}
	}, []);

	return (
		<>
			<Banner />
			<Divider style={{ mt: '56px' }} />

			{config.PROJECT.id === 'toddlerpillars' ? (
				<>
					<Typography variant='heading1' sx={{ mt: '80px', textAlign: 'center' }}>Overview</Typography>
					<Divider titleDivider />
					<Overview />
					<Divider style={{ mt: '80px' }} />
				</>
			) : null}

			<Typography variant='heading1' sx={{ mt: '80px', textAlign: 'center' }}>Our Team</Typography>
			<Divider titleDivider />
			<Team />
			<Discord />
		</>
	);
};

export default Home;
