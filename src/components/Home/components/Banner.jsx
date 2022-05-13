import React, { useRef, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import Slider from 'react-slick';
import Countdown from 'react-countdown';
import discord from '../../../assets/images/social/discord.svg';
import Divider from '../../common/Divider';
import navPrev from '../../../assets/images/slider-prev.svg';
import navNext from '../../../assets/images/slider-next.svg';
import Explorer from './Explorer';
import SaleCard from './SaleCard';
import Checkout from './Checkout';
import SocialButton from '../../common/SocialButton';
import config from '../../../config';

import tp1 from '../../../assets/images/carousel/tp01.jpg';
import cp1 from '../../../assets/images/carousel/cp02.jpg';
import tp2 from '../../../assets/images/carousel/tp13.jpg';
import cp2 from '../../../assets/images/carousel/cp04.jpg';
import tp3 from '../../../assets/images/carousel/tp11.jpg';
import cp3 from '../../../assets/images/carousel/cp06.jpg';
import tp4 from '../../../assets/images/carousel/tp12.jpg';
import cp4 from '../../../assets/images/carousel/cp01.jpg';
import tp5 from '../../../assets/images/carousel/tp02.jpg';
import cp5 from '../../../assets/images/carousel/cp05.jpg';
import tp6 from '../../../assets/images/carousel/tp15.jpg';
import cp6 from '../../../assets/images/carousel/cp03.jpg';
import cp7 from '../../../assets/images/carousel/cp07.jpg';
import cp8 from '../../../assets/images/carousel/cp08.jpg';
import cp9 from '../../../assets/images/carousel/cp09.jpg';


const BP1 = '@media (max-width: 1079px)';
const BP2 = '@media (max-width: 1480px) and (min-width:1199px)';

const { colors } = config.PROJECT;

const presaleStart = 1652698800 * 1000;

const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return null;
  } else {
    // Render a countdown
    return (
			<div
				style={sx.countdownWrapper}
			>
				<div
					style={sx.countdownComponent}
				>
					<span style={sx.countdownValue}>{days}</span>
					<span>Days</span>
				</div>

				<div
					style={sx.countdownComponent}
				>
					<span style={sx.countdownValue}>{hours}</span>
					<span>Hrs</span>
				</div>

				<div
					style={sx.countdownComponent}
				>
					<span style={sx.countdownValue}>{minutes}</span>
					<span>Mins</span>
				</div>

				<div
					style={sx.countdownComponent}
				>
					<span style={sx.countdownValue}>{seconds}</span>
					<span>Secs</span>
				</div>
			</div>
		)
  }
}

const sx = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row-reverse',
		justifyContent: 'center',
		gap: '40px 40px',
		pt: '80px',
		[BP1]: {
			flexWrap: 'wrap',
		},
		[BP2]: {
			flexWrap: 'wrap',
		},
	},
	countdownWrapper: {
		display: 'flex',
		alignItems: 'center',
		margin: '1rem 0 2rem 0',
	},
	countdownComponent: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		margin: '0 5px',
		padding: '10px 10px 5px 10px',
		border: `1px solid ${colors.primary}`,
		borderRadius: '4px',
	},
	countdownValue: {
		fontSize: '1.75rem',
	},
	content: {
		width: '100%',
		maxWidth: '460px',
		// pt: '24px',
		zIndex: '1',
		[BP1]: {
			pt: '40px',
		},
		[BP2]: {
			maxWidth: '70%',
			pt: 0,
		},
	},
	rightContainer: {
		// alignSelf: 'center',
		position: 'relative',
		width: '100%',
		maxWidth: '658px',
		minWidth: '55%',
		boxSizing: 'border-box',
		[BP1]: {
			minWidth: 'unset',
		},
	},
	imageContainer: {
		overflow: 'hidden',
		width: '100%',
		aspectRatio: '1 / 1',
		cursor: 'pointer',
	},
	carouselImageContainer: {
		outline: 'none',
	},
	sliderNavContainer: {
		position: 'relative',
		width: '100%',
		mt: '8px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: '0 24px',
	},
	sliderNavBtn: {
		width: '40px',
		cursor: 'pointer',
		filter: config.PROJECT.id === 'chimerapillars' ? 'invert(100%)' : 'none',
	},
	discordBtn: {
		width: '100%',
		maxWidth: '280px',
		height: '44px',
		backgroundColor: 'primary.main',
		borderRadius: '30px',
		mt: '24px',
		mb: '40px',
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[BP1]: {
			mx: 'auto',
		},
	},
	socialContainer: {
		display: 'flex',
		flexDirection: 'row',
		gap: '0 24px',
		[BP1]: {
			justifyContent: 'center',
		},
	},
	title: {
		[BP1]: {
			textAlign: 'center',
		},
	},
	text1: {
		mt: '16px',
		[BP1]: {
			mt: '24px',
		},
	},
	url: {
		color: colors.primary,
		'&:hover': {
			textDecoration: 'none',
			color: colors.primary,
			opacity: 0.9,
		},
	},
};

const HEADER_TEXT = `Through a ragged hole in reality crawl 9,999 Toddlerpillar NFTs
generated from 888 mind-bending traits, including 60 ultra-rare 1/1s! The collection
continues the twenty-year history of artist and gallerist Jon Beinart's renowned doll
sculptures, imbuing them with fresh psychedelic energy from award-winning artist and
madman, Tim Molloy. `;

const HEADER2_TEXT = `Toddlerpillar holders join an inter-dimensional art collective with access to global gatherings, exclusive airdrops, IRL collectable toys, jewellery, merch & much more!`

const HEADER3_TEXT = `Each Toddlerpillar holder can summon a free Chimerapillar NFT from
our companion collection in the second quarter of 2022. Members who hold both of our NFTs
will be rewarded with access to a 100+ page graphic novel exploring our lore.`

const DISCORD_TEXT = 'Join our delightfully strange discord family!';

let IMAGES = [tp1, cp1, tp2, cp2, tp3, cp3, tp4, cp4, tp5, cp5, tp6, cp6];

if (config.PROJECT.id === 'chimerapillars') {
	IMAGES = [cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9];
}

const url = 'https://discord.gg/toddlerpillars';

const bold = (children) => <Box component='span' sx={{ fontFamily: 'roboto-bold' }}>{children}</Box>;

const sliderConfig = (setCurrentSlide) => ({
	infinite: true,
	speed: 500,
	fade: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	vertical: false,
	// arrows: false,
	autoplay: true,
	autoplaySpeed: 1000,
	adaptiveHeight: true,
	afterChange: setCurrentSlide,
});

const Banner = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [selectedSlide, setSelectedSlide] = useState(2);
	const [explorerVisible, setExplorerVisible] = useState(false);
	const [checkoutVisible, setCheckoutVisible] = useState(false);
	const [mintInfo, setMintInfo] = useState({
		role: null,
		canMintEc: false,
		canMintSale: false,
		saleMaxToken: 0,
		ecMaxToken: 0,
		ecUserMinted: 0,
		userMinted: 0,
		price: 0,
	});
	const [mainSaleStarted, setMainSaleStarted] = useState(false);

	const vertical = useMediaQuery('(max-width: 1079px)');
	const sliderRef = useRef(null);

	const handleCarouselClicked = () => {
		setSelectedSlide(currentSlide);
		setExplorerVisible(true);
	};

	return (
		<Box sx={sx.root}>
			<Box sx={sx.rightContainer}>
				<Box sx={sx.imageContainer} onClick={handleCarouselClicked}>
					<Slider {...(sliderConfig(setCurrentSlide))} ref={sliderRef}>
						{IMAGES.map((image, i) => (
							<Box key={i.toString()} sx={sx.carouselImageContainer}>
								<img src={image} style={{ width: '100%' }} alt={`Carousel ${i + 1}`} />
							</Box>
						))}
					</Slider>
				</Box>
				<Box sx={sx.sliderNavContainer}>
					<Box />
					{!vertical && (
						<>
							<Box sx={sx.sliderNavBtn} onClick={() => sliderRef.current.slickPrev()}>
								<img src={navPrev} alt='Previous' />
							</Box>
							<Box sx={sx.sliderNavBtn} onClick={() => sliderRef.current.slickNext()}>
								<img src={navNext} alt='Next' />
							</Box>
						</>
					)}
					<Typography sx={{ position: 'absolute', right: 0 }}>{`${currentSlide + 1} of ${IMAGES.length}`}</Typography>
				</Box>
			</Box>
			<Box sx={sx.content}>
				{config.PROJECT.id === 'toddlerpillars' ? (
					<>
						<Box sx={sx.col}>
							<Typography variant='heading2' sx={sx.title}>Toddlerpillars & Chimerapillars</Typography>
							{vertical && <Divider titleDivider />}
							<Typography variant='text' sx={{ ...sx.text1, mb: 2 }}>{HEADER_TEXT}</Typography>

							<Typography variant='text' sx={{ ...sx.text1, mb: 2 }}>{HEADER2_TEXT}</Typography>

							<Typography variant='text' sx={{ ...sx.text1, mb: 2 }}>{HEADER3_TEXT}</Typography>

							{/* {!mainSaleStarted
								&& (
									<Typography variant='text' sx={{ ...sx.text2, my: '16px' }}>
										{bold('Public Sale starts 12pm EST on Nov 19th.')}
									</Typography>
								)} */}
							<br />
							<br />
						</Box>

						<Box sx={sx.col}>
							<Typography variant='heading2' sx={sx.title}>Chimerapillars Are Minting Soon</Typography>
							{vertical && <Divider titleDivider />}
							<Typography variant='text' sx={{ ...sx.text1, mb: 2 }}>Toddlerpillars sold out on November 2021 and are now available on the secondary market on <a style={{ textDecoration: 'none', color: colors.primary, fontWeight: '700' }} href="https://opensea.io/collection/toddlerpillars" target="_blank">OpenSea</a>. <br /><br />
							Our companion creatures, The <a style={{ textDecoration: 'none', color: colors.primary, fontWeight: '700' }} href="https://twitter.com/chimerapillars" target="_blank">Chimerapillars</a> will be summoned soon to rescue the Toddlerpillars from the corruption of the lonely Pillar!<br /><br />
							All Toddlerpillar parents will get a FREE Chimerapillars mint and a discount on additional mints during the Chimerapillar presale!<br /><br />
							<a style={{ textDecoration: 'none', color: colors.primary, fontWeight: '700' }} href="https://opensea.io/collection/toddlerpillars" target="_blank">Adopt a Toddlerpillar</a> today to secure your place!</Typography>
							{/* <SaleCard
								mintOnClick={(mintInfo) => {
									setCheckoutVisible(true);
									setMintInfo(mintInfo);
								}}
								setMainSaleStarted={setMainSaleStarted}
							/> */}
						</Box>

						{/* <Typography variant='text' sx={{ ...sx.text2, mt: '16px' }}>
							{bold(
								<>
									Check collection on
									{' '}
									<Box
										component='a'
										sx={sx.url}
										href='https://opensea.io/collection/toddlerpillars'
										target='_blank'
										rel='noopener noreferrer'
									>
										OpenSea
									</Box>
								</>,
							)}
						</Typography> */}

						{/*
						<Typography variant='text' sx={{ mt: '16px' }}>{DISCORD_TEXT}</Typography>
						<a href={url} target='_blank' rel='noopener noreferrer'>
							<Box sx={sx.discordBtn}>
								<img src={discord} style={{ height: 35 }} alt='Discord' />
							</Box>
						</a>
						<Box sx={sx.socialContainer}>
							<SocialButton variant='instagram' />
							<SocialButton variant='twitter' />
							<SocialButton variant='email' />
						</Box> */}
					</>
				) : null}

				{config.PROJECT.id === 'chimerapillars' ? (
					<>
						<Box sx={sx.col}>
							<Typography variant='heading2' sx={sx.title}>Chimerapillars Are Here!</Typography>

							{vertical && <Divider titleDivider />}

							<Typography variant='text' sx={{ ...sx.text1, mb: 2 }}>
								<strong>8888 Chimerapillars with 888 traits</strong> have been summoned to save humanity from the Toddlerpillar apocalypse. Madness and mayhem have plagued the world since the 6 armed bebehs tore a hole in our reality! Can the Chimerapillars rescue their infantile cousins from the corruption of the lonely pillar?
								<br/>
								<br/>
								Members who hold both a Toddler and a Chimera will be rewarded with a 100+ page multimedia graphic novel exploring our lore in late 2022.
								<br/>
								<br/>
								TP holders who submitted their wallets via discord before May 10 can mint 1 FREE Chimera during our presale or 2 FREE Chimeras if they hold 9+ TPs.
								<br/>
								<br/>
								<strong>OUR 1 WEEK PRESALE BEGINS IN:</strong>

								{presaleStart > Date.now() ? (
									<Countdown
										date={presaleStart}
										onComplete={() => window.location.reload()}
										renderer={countdownRenderer}
									/>
								) : null}

								<strong>Chimerapillars Mint price: 0.03 ETH.
								<br/>
								<br/>
								Only wallets holding Toddlerpillars can mint during Chimerapillar presale. <a style={{ textDecoration: 'none', color: colors.primary, fontWeight: '700' }} href="https://opensea.io/collection/toddlerpillars" target="_blank">Adopt a Toddlerpillar!</a>
								<br/>
								<br/>
								Public sale starts May 23.</strong>
							</Typography>

							{/* @TEMP un-comment to show mint panel
							<SaleCard
								mintOnClick={(mintInfo) => {
									setCheckoutVisible(true);
									setMintInfo(mintInfo);
								}}
								setMainSaleStarted={setMainSaleStarted}
							/>*/}
						</Box>

						{/* @TEMP un-comment to show OS link
						<Typography variant='text' sx={{ ...sx.text2, mt: '16px' }}>
							{bold(
								<>
									Check collection on
									{' '}
									<Box
										component='a'
										sx={sx.url}
										href='https://opensea.io/collection/chimerapillars'
										target='_blank'
										rel='noopener noreferrer'
									>
										OpenSea
									</Box>
								</>
							)}
						</Typography>*/}

						{/*
						<Typography variant='text' sx={{ mt: '16px' }}>{DISCORD_TEXT}</Typography>
						<a href={url} target='_blank' rel='noopener noreferrer'>
							<Box sx={sx.discordBtn}>
								<img src={discord} style={{ height: 35 }} alt='Discord' />
							</Box>
						</a>
						<Box sx={sx.socialContainer}>
							<SocialButton variant='instagram' />
							<SocialButton variant='twitter' />
							<SocialButton variant='email' />
						</Box> */}
					</>
				) : null}
			</Box>
			<Checkout isOpen={checkoutVisible} setOpen={setCheckoutVisible} mintInfo={mintInfo} />
			<Explorer isOpen={explorerVisible} setOpen={setExplorerVisible} images={IMAGES} initialSlide={selectedSlide} />
		</Box>
	);
};

export default Banner;
