import React, { useEffect, useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toast';
import { Box, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { SpinnerRoundOutlined as Spinner } from 'spinners-react';
import Web3Ctx from "../../../components/Context/Web3Ctx";
import { useChimeraContract, useSaleContract } from '../../../hooks/useContract';
import Divider from '../../common/Divider';
import MintQuantity from './MintQuantity';
import config from '../../../config';
import close from '../../../assets/images/close.svg';

const BP1 = '@media (max-width: 899px)';
const BP2 = '@media (max-width: 719px)';
const { colors } = config.PROJECT;

const sx = {
	root: {
		height: '100%',
		overflow: 'auto',
		backgroundColor: colors.background,
		py: '44px',
		px: '125px',
		position: 'relative',
		transition: 'all .3s',
		[BP1]: {
			px: '85px',
		},
		[BP2]: {
			px: '25px',
		},
	},
	title: {
		mt: '20px',
		textAlign: 'center',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'top',
		textAlign: 'center',
		gap: '0 25px',
	},
	textContainer: {
		position: 'absolute',
		mt: '8px',
		width: '100%',
		height: '26px',
		left: 0,
	},
	closeBtn: {
		position: 'absolute',
		width: '32px',
		min: '32px',
		top: '20px',
		right: '20px',
		cursor: 'pointer',
		pointerEvents: 'auto',
		filter: config.PROJECT.id === 'chimerapillars' ? 'invert(100%)' : 'none',
	},
	url: {
		textDecoration: 'none',
		color: colors.primary,
		fontWeight: '700',
	},
	darkOverlay: {
		zIndex: 100,
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.8)',
	},
	noFreeClaims: {
		display: "flex",
		flexDirection: "column",
		maxWidth: "458px",
		width: "100%",
		margin: "auto",
		mb: 3,
		padding: '0 2em 1.5em 2em',
		backgroundColor: colors.background,
		display: "flex",
		justifyContent: "center",
		border: `1px solid ${colors.highlight}`,
		borderRadius: 2,
		marginTop: 4,
	},
};

const Checkout = ({ isOpen, setOpen, configs }) => {
	const [approveInProgress, setApproveInProgress] = useState(false);
	const [txInProgress, setTxInProgress] = useState(false);
	const [txEtherScan, setTxEtherScan] = useState(null);
	const { address } = useContext( Web3Ctx )

	const history = useHistory();
	const chimeraContract = useChimeraContract();

	const ethPrice = parseFloat( configs?.contractConfig?.ethPrice || '0.03' );
	const isClaimActive = configs?.contractConfig?.isClaimActive || false;
	const isPresaleActive = configs?.contractConfig?.isPresaleActive || false;
	const isMainsaleActive = configs?.contractConfig?.isMainsaleActive || false;

	let canClaim = 0;
	if( configs?.ownerConfig?.toddlers > 0 ){
		++canClaim;

		if( configs.ownerConfig.toddlers > 8 )
			++canClaim;

		canClaim -= configs.ownerConfig.claimed;
	}

	let canMintPresale = 0;
	if( configs?.ownerConfig?.toddlers > 0 ){
		canMintPresale = 4 - configs.ownerConfig.purchased;
	}

	// Get signature for mint.
	const getSignature = async (quantity) => {
		let sig = '0x00'

		const resp = await fetch(`https://node.herodevelopment.com/signature?account=${address}&contract=${chimeraContract.address}&quantity=${quantity}`)

		if (resp) {
			const json = await resp.json()

			if (json?.signature) {
				sig = json.signature
			}
		}

		return sig
	}

	const handleClaim = async (quantity, totalPrice) => {
		setApproveInProgress(true);

		console.log('claim', quantity, totalPrice);

		const payingAmount = ethers.utils.parseEther(totalPrice.toString());

		await chimeraContract
			.claim(quantity, { value: payingAmount })
			.then((tx) => {
				setApproveInProgress(false);
				setTxInProgress(true);
				console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				return tx.wait().then((receipt) => {
					console.log('txReceipt: ', receipt);
					if (receipt && receipt.status === 1) {
						toast.success('Successfully Bought NFT');
						history.replace({ ...history.location, state: null });
						setOpen(false);
						setTxEtherScan(null);
					} else {
						toast.error('Transaction Failed');
						setTxInProgress(false);
						setTxEtherScan(null);
					}
				});
			})
			.catch(handleError);

		setTxInProgress(false);
		setApproveInProgress(false);
	};


	const handlePresaleMint = async (quantity, totalPrice) => {
		setApproveInProgress(true);

		console.log('presale', quantity, totalPrice);

		const signature = await getSignature(quantity);
		const payingAmount = ethers.utils.parseEther(totalPrice.toString());

		await chimeraContract
			.mint(quantity, signature, { value: payingAmount })
			.then((tx) => {
				setApproveInProgress(false);
				setTxInProgress(true);
				console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				return tx.wait().then((receipt) => {
					console.log('txReceipt: ', receipt);
					if (receipt && receipt.status === 1) {
						toast.success('Successfully Bought NFT');
						history.replace({ ...history.location, state: null });
						setOpen(false);
						setTxEtherScan(null);
					} else {
						toast.error('Transaction Failed');
						setTxInProgress(false);
						setTxEtherScan(null);
					}
				});
			})
			.catch(handleError);

		setTxInProgress(false);
		setApproveInProgress(false);
	};


	const handleMainsaleMint = async (quantity, totalPrice) => {
		setApproveInProgress(true);

		console.log('main', quantity, totalPrice);

		const signature = await getSignature(quantity);
		const payingAmount = ethers.utils.parseEther(totalPrice.toString());

		await chimeraContract
			.mint(quantity, signature, { value: payingAmount })
			.then((tx) => {
				setApproveInProgress(false);
				setTxInProgress(true);
				console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
				return tx.wait().then((receipt) => {
					console.log('txReceipt: ', receipt);
					if (receipt && receipt.status === 1) {
						toast.success('Successfully Bought NFT');
						history.replace({ ...history.location, state: null });
						setOpen(false);
						setTxEtherScan(null);
					} else {
						toast.error('Transaction Failed');
						setTxInProgress(false);
						setTxEtherScan(null);
					}
				});
			})
			.catch(handleError);

		setTxInProgress(false);
		setApproveInProgress(false);
	};

	const handleError = (e) => {
		console.error(e)

		if (e.error && e.error.message) {
			toast.error(e.error.message);
		} else if (e.message) {
			toast.error(e.message);
		} else if (e.reason) {
			toast.error(e.reason);
		}
	};

	return (
		<Modal
			open={isOpen}
			onClose={(event, reason) => {
				if (reason !== 'backdropClick' && !txInProgress && !approveInProgress) {
					setOpen(false);
				}
			}}
		>
			<Box sx={sx.root}>
				<Box sx={sx.content}>
					{!txInProgress ? (
						<>
							<Typography variant='heading1' sx={sx.title}>
								Checkout Page
							</Typography>
							<Divider titleDivider />
							<Typography variant='text' sx={{ my: 4 }}>
								Please select the number of NFTs you want to mint.
							</Typography>
							{isClaimActive && (
								<>
									{canClaim ? (
										<MintQuantity
											title='Free Claims'
											price="0"
											maxAmount={canClaim}
											onClickMint={handleClaim}
										/>
									) : (
										<Box sx={sx.noFreeClaims}>
											<Typography variant='heading2' sx={sx.title}>
												Free Claims
											</Typography>
											<Typography>
												{`Sorry, your wallet is not eligible for Free Claims, but you can still mint for ${ethPrice} below.`}
											</Typography>
										</Box>
									)}
								</>
							)}
							{isPresaleActive ? (
								<MintQuantity
									title='Presale Mint'
									price={ethPrice}
									maxAmount={canMintPresale}
									onClickMint={handlePresaleMint}
								/>
							):
							(isMainsaleActive && (
								<MintQuantity
									title='Public Sale Mint'
									price={ethPrice}
									// maxAmount={saleMaxToken}
									maxAmount={8} // hardcoded limit 10
									onClickMint={handleMainsaleMint}
								/>
							))}
						</>
					) : (
						<>
							<Typography variant='heading1' sx={sx.title}>
								Transaction In Progress
							</Typography>
							<Divider titleDivider />
							<Typography variant='text' sx={{ my: 4 }}>
								Please wait while your transaction is being processed.
								{' '}
								<br />
								{txEtherScan && (
									<>
										You can check the transaction status on
										{' '}
										<Box
											component='a'
											href={txEtherScan}
											sx={sx.url}
											target='_blank'
											rel='noopener noreferrer'
										>
											Etherscan
										</Box>
										.
									</>
								)}
							</Typography>

							<Spinner
								color={colors.primary}
								style={{ marginLeft: 'auto', marginRight: 'auto' }}
							/>
						</>
					)}
				</Box>

				{approveInProgress && <Box sx={sx.darkOverlay} />}

				{!txInProgress && (
					<Box sx={sx.closeBtn} onClick={() => !txInProgress && setOpen(false)}>
						<img src={close} style={{ width: '100%' }} alt='Close' />
					</Box>
				)}
			</Box>
		</Modal>
	);
};

/* eslint-disable react/forbid-prop-types */
Checkout.propTypes = {
	configs: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setOpen: PropTypes.any.isRequired,
};
export default Checkout;
