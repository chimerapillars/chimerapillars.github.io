import React, { useEffect, useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toast';
import { Box, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { SpinnerRoundOutlined as Spinner } from 'spinners-react';
import Web3Ctx from "../../../components/Context/Web3Ctx";
import { useChimeraContract, useChimeraMinterContract } from '../../../hooks/useContract';
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

const Checkout = ({ isOpen, setOpen, configs, discounts }) => {
	const [approveInProgress, setApproveInProgress] = useState(false);
	const [txInProgress, setTxInProgress] = useState(false);
	const [txEtherScan, setTxEtherScan] = useState(null);
	const { address } = useContext( Web3Ctx )

	const history = useHistory();
	const chimeraContract = useChimeraContract();
	const chimeraMinterContract = useChimeraMinterContract();

	let ethPrice = parseFloat( configs?.contractConfig?.ethPrice || '0.03' );
	const hasClaim = configs?.ownerConfig?.hasClaim || false;
	const isClaimActive = configs?.contractConfig?.isClaimActive || false;
	const isPresaleActive = configs?.contractConfig?.isPresaleActive || false;
	const isMainsaleActive = configs?.contractConfig?.isMainsaleActive || false;

	// Check for discounts.
	let activeDiscount
	let discountNames
	if (!!discounts?.length) {
		activeDiscount = discounts[0]
		ethPrice = activeDiscount.price
	}

	console.log({ activeDiscount })

	let canClaim = 0;
	if( configs?.ownerConfig?.hasClaim ){
		if( configs.ownerConfig.toddlers > 0 )
			++canClaim;

		if( configs.ownerConfig.toddlers > 8 )
			++canClaim;

		canClaim -= configs.ownerConfig.claimed;
	}

	let canMintPresale = 0;
	if( configs?.ownerConfig?.toddlers > 0 ){
		canMintPresale = 4 - configs.ownerConfig.purchased;
	}

	// Get signature for claim.
	const getClaimSignature = async (quantity) => {
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

	// Get signature for discount.
	const getDiscountSignature = async (quantity) => {
		let sig = '0x00'

		const extraData = encodeURIComponent(JSON.stringify([
			{ type: 'address', value: activeDiscount.contractAddress },
			{ type: 'string', value: activeDiscount.slug },
		]))
		const resp = await fetch(`https://52kv1xw2o5.execute-api.us-east-1.amazonaws.com/prod/presale-signature?contract=${chimeraContract.address.toLowerCase()}&account=${address.toLowerCase()}&quantity=${quantity}&extraData=${extraData}`)

		if (resp) {
			const json = await resp.json()

			if (json?.signature) {
				sig = json.signature
			}
		}

		return sig
	}

	// Hanlde claim.
	const handleClaim = async (quantity, totalPrice) => {
		try{
			console.log('claim', quantity, totalPrice);
			if( !isClaimActive ){
				toast.error('Claims are not active');
				return;
			}

			setApproveInProgress(true);

			let tx;
			const signature = await getClaimSignature(quantity);


			try{
				await chimeraContract.estimateGas.claim(quantity, signature);
				tx = await chimeraContract.claim(quantity, signature);
			}
			catch( err ){
				if( err.code && err.code === -32602 ){
					const sendArgs = { type: '0x1' };
					await chimeraContract.estimateGas.claim(quantity, signature, sendArgs);
					tx = await chimeraContract.claim(quantity, signature, sendArgs);
				}
				else{
					throw err
				}
			}

			setApproveInProgress(false);
			setTxInProgress(true);
			console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
			setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);

			const receipt = await tx.wait();
			console.log('txReceipt: ', receipt);
			if (receipt && receipt.status === 1) {
				toast.success('Successfully Bought NFT');
				history.replace({ ...history.location, state: null });
				setOpen(false);
			}
			else{
				toast.error('Transaction Failed');
			}
		}
		catch( err ){
			handleError( err )
		}
		finally{
			setApproveInProgress(false);
			setTxInProgress(false);
			setTxEtherScan(null);
		}
	};

	// Handle standard mint.
	const handleMint = async (quantity, totalPrice) => {
		try{
			console.log('mint', quantity, totalPrice);

			if( configs.contractConfig.isMainsaleActive ){
				//no-op
			}
			else if( configs.contractConfig.isPresaleActive ){
				if( !configs.ownerConfig.toddlers ){
					toast.error('Only wallets holding Toddlerpillars can mint during presale' );
					return;
				}
			}
			else{
				toast.error('Sales are not active');
				return;
			}


			setApproveInProgress(true);

			let tx;
			const payingAmount = ethers.utils.parseEther(totalPrice.toString());

			try{
				await chimeraContract.estimateGas.mint(quantity, { value: payingAmount });
				tx = await chimeraContract.mint(quantity, { value: payingAmount })
			}
			catch( err ){
				if( err.code && err.code === -32602 ){
					const sendArgs = { value: payingAmount, type: '0x1' };
					await chimeraContract.estimateGas.mint(quantity, sendArgs);
					tx = await chimeraContract.mint(quantity, sendArgs);
				}
				else{
					throw err
				}
			}

			setApproveInProgress(false);
			setTxInProgress(true);
			console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
			setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);

			const receipt = await tx.wait()
			console.log('txReceipt: ', receipt);
			if (receipt && receipt.status === 1) {
				toast.success('Successfully Bought NFT');
				history.replace({ ...history.location, state: null });
				setOpen(false);
			}
			else{
				toast.error('Transaction Failed');
			}
		}
		catch( err ){
			handleError( err )
		}
		finally{
			setApproveInProgress(false);
			setTxInProgress(false);
			setTxEtherScan(null);
		}
	};

	const handleDiscountMint = async (quantity, totalPrice) => {
		try{
			console.log('mint discount', quantity, totalPrice);

			if( configs.contractConfig.isMainsaleActive ){
				//no-op
			} else {
				toast.error('Sales are not active');
				return;
			}


			setApproveInProgress(true);

			const signature = await getDiscountSignature(quantity)

			let tx;
			const payingAmount = ethers.utils.parseEther(totalPrice.toString());

			try{
				await chimeraMinterContract.estimateGas.mint(quantity, { value: payingAmount });
				tx = await chimeraMinterContract.mint(quantity, { value: payingAmount })
			}
			catch( err ){
				if( err.code && err.code === -32602 ){
					const sendArgs = { value: payingAmount, type: '0x1' };
					await chimeraMinterContract.estimateGas.mint(quantity, sendArgs);
					tx = await chimeraMinterContract.mint(quantity, sendArgs);
				}
				else{
					throw err
				}
			}

			setApproveInProgress(false);
			setTxInProgress(true);
			console.log(`${config.ETHERSCAN_URL}tx/${tx.hash}`);
			setTxEtherScan(`${config.ETHERSCAN_URL}tx/${tx.hash}`);

			const receipt = await tx.wait()
			console.log('txReceipt: ', receipt);
			if (receipt && receipt.status === 1) {
				toast.success('Successfully Bought NFT');
				history.replace({ ...history.location, state: null });
				setOpen(false);
			}
			else{
				toast.error('Transaction Failed');
			}
		}
		catch( err ){
			handleError( err )
		}
		finally{
			setApproveInProgress(false);
			setTxInProgress(false);
			setTxEtherScan(null);
		}
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

							{isClaimActive && hasClaim && (
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
									onClickMint={handleMint}
								/>
							):
							(isMainsaleActive && (
								<MintQuantity
									title='Public Sale Mint'
									price={ethPrice}
									// maxAmount={saleMaxToken}
									maxAmount={8} // hardcoded limit 10
									onClickMint={activeDiscount ? handleDiscountMint : handleMint}
									discounts={discounts}
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

					<Typography>Chimerapillars collection on <a href="https://opensea.io/collection/chimera-pillars" target="_blank" style={{ color: 'rgb(194, 192, 253)' }}>OpenSea</a></Typography>
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
