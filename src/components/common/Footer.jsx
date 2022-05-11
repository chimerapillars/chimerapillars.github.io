import React from 'react';
import { Box, Typography } from '@mui/material';
import SocialButton from './SocialButton';
import config from '../../config'

const { colors } = config.PROJECT;

const sx = {
	root: {
		width: '100%',
		p: '24px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '24px',
		backgroundColor: colors.highlight,
	},
	socialContainer: {
		display: 'flex',
		flexDirection: 'row',
		gap: '24px 24px',
	},
};

const Footer = () => (
	<Box sx={sx.root}>
		<Box sx={sx.socialContainer}>
			{Object.keys(config.PROJECT.socials).map((network) => (
				<SocialButton key={network} variant={network} />
			))}
		</Box>
		<Typography variant='text' sx={{ textAlign: 'center' }}>Copyright © {new Date().getFullYear()}, {config.PROJECT.name}</Typography>
	</Box>
);

export default Footer;
