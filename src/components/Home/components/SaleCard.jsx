import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Web3Ctx from "../../Context/Web3Ctx";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { SpinnerDotted } from "spinners-react";
import ethIcon from "../../../assets/images/eth.svg";
import config from '../../../config';

import {
  useChimeraContract,
  useSaleContract
} from "../../../hooks/useContract";

import useInterval from "../../../hooks/useInterval";

import { sigs } from "../../../sig";

const BP1 = "@media (max-width: 1079px)";
const BP2 = "@media (max-width: 1480px) and (min-width:1199px)";

const project = config.PROJECT;
const { colors } = project;
const COLOR_RED = "#F85353";

const baseBtn = {
  fontSize: 16,
  width: "100%",
  minWidth: "150px",
  height: "40px",
  backgroundColor: "primary.main",
  borderRadius: "22px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "roboto-bold",
  transition: "all .3s",
  textTransform: "unset",
  outline: "none",
  border: "none",
  "&:focus": {
    outlineColor: colors.highlight,
  },
  "&:disabled": {
    backgroundColor: "primary.main",
    cursor: "not-allowed",
    opacity: 0.5,
  },
};

const sx = {
  root: {
    backgroundColor: colors.background,
    minHeight: 200,
    display: "flex",
    justifyContent: "center",
    border: `1px solid ${colors.highlight}`,
    borderRadius: 2,
    marginTop: 4,
  },
  cardContent: {
    width: "100%",
  },
  title: {
    [BP1]: {
      textAlign: "center",
    },
  },
  text1: {
  },
  textLink: {
    cursor: "pointer",
  },
  roleContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    mb: 2,
    pr: 3,
    [BP2]: {
      justifyContent: "left",
    },
  },
  mintRole: {
    textAlign: "left",
    fontSize: 14,
    fontWeight: 700,
    pr: "10px",
    whiteSpace: "nowrap",
    [BP2]: {
      pr: 3,
      minWidth: "130px",
    },
  },
  mintRole2: {
    mr: 5,
    [BP2]: {
      // mr: 1,
    },
  },
  errorText: {
    mt: 3,
    fontSize: 14,
    fontWeight: 500,
    color: COLOR_RED,
  },
  saleText: {
    fontSize: 32,
    fontFamily: "roboto-bold",
    fontWeight: 900,
    lineHeight: 1.2,
  },
  saleSubText: {
    fontSize: 14,
    lineHeight: 1,
  },
  img: {
    height: "22px",
    alignSelf: "center",
    marginRight: "5px",
    filter: config.PROJECT.id === 'chimerapillars' ? 'saturate(0%)' : 'none',
  },
  btnsContainer: {
    mt: -2,
    mb: 0,
  },
  mintBtn: {
    ...baseBtn,
    backgroundColor: colors.primary,
    "&:disabled": {
      backgroundColor: colors.highlight,
    },
  },
  connectBtn: {
    ...baseBtn,
    backgroundColor: colors.highlight,
    border: 'none',
    "&:hover": {
      backgroundColor: colors.highlight,
      border: 'none',
    },
    "&:focus": {
      backgroundColor: colors.highlight,
      outlineColor: colors.text,
      opacity: 0.8,
    },
    "&:active": {
      outlineColor: "unset",
    },
  },
};

const PRESALE_HEADER = `${project.name} Presale`;

const SALE_HEADER = `${project.name} Public Sale`;

const SALE_ENDED_HEADER = `${project.name} Sale Ended`;

const TextLink = ({ onClick, children }) => {
  return (
    <Typography
      variant="text"
      component="span"
      sx={sx.textLink}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
};

const SaleCard = ({ setConfigs, setCheckoutVisible, setMainSaleStarted }) => {
  const { handleConnect, address, isCorrectNetwork } = useContext(Web3Ctx);
  const chimeraContract = useChimeraContract();
  const toddlerContract = useSaleContract();

  //10 seconds
  const [checkInterval, setCheckInterval] = useState(10_000);
  const [isLoading, setLoading] = useState(true);
  const [contractConfig, setContractConfig] = useState({
    ethPrice: "30000000000000000",

    maxMint:      4,
    maxOrder:     4,
    maxSupply: 8888,

    isClaimActive:    false,
    isPresaleActive:  false,
    isMainsaleActive: false
  });

  const [ownerConfig, setOwnerConfig] = useState({
    balance: 0,
    claimed: 0,
    purchased: 0,
  });


  useEffect(() => {
    if( isLoading ){
      init();
      setLoading( false );
    }
  }, []);


  useInterval(() => {
    console.log("refreshing");
    if( config.isClaimActive || config.isPresaleActive || config.isMainsaleActive ){
      init();
    }
    else{
      console.log("end interval");
      setCheckInterval(null);
    }
  }, checkInterval);

  const init = async () => {
    const tmpConfig = await chimeraContract.CONFIG();
    const config = {
      weiPrice: tmpConfig.ethPrice.toString(),
      ethPrice: ethers.utils.formatEther( tmpConfig.ethPrice.toString() ),

      maxMint:   parseInt( tmpConfig.maxMint.toString() ),
      maxOrder:  parseInt( tmpConfig.maxOrder.toString() ),
      maxSupply: parseInt( tmpConfig.maxSupply.toString() ),

      isClaimActive:    tmpConfig.isClaimActive,
      isPresaleActive:  tmpConfig.isPresaleActive,
      isMainsaleActive: tmpConfig.isMainsaleActive
    };
    config.totalSupply = parseInt((await chimeraContract.totalSupply()).toString());

    if( address ){
      const tmpOwner = await chimeraContract.owners( address );
      const toddlers = await toddlerContract.balanceOf( address );
      const owner = {
        balance:   parseInt(tmpOwner.balance.toString()),
        claimed:   parseInt(tmpOwner.claimed.toString()),
        purchased: parseInt(tmpOwner.purchased.toString()),
        toddlers: parseInt(toddlers.toString())
      };

      setOwnerConfig( owner );
      setConfigs({
        contractConfig: config,
        ownerConfig: owner
      });
    }
    else{
      setConfigs({
        contractConfig: config,
        ownerConfig
      });
    }

    setMainSaleStarted( config.isMainsaleActive );
    setContractConfig( config );
  };

  const gotoRoadmap = () => {
    history.push("/roadmap#earlyMidSection");
  };

  const handleMintClicked = () => {
    setCheckoutVisible( true );
  }

  const limitReached = !(ownerConfig.purchased < contractConfig.maxMint);
  const disableMintBtn = !isCorrectNetwork || limitReached || !address;

  const render = () => {
    if( isLoading ){
      return (
        <Card sx={sx.root}>
          <Box display="flex" sx={{ justifyContent: "center" }}>
            <SpinnerDotted color={colors.highlight} />
          </Box>
        </Card>
      );
    }


    //sale ended
    if( contractConfig.totalSupply >= contractConfig.maxSupply ){
      return (
        <Card sx={sx.root}>
          <CardContent sx={sx.cardContent}>
            <Typography variant="heading1" sx={sx.title}>
              {SALE_ENDED_HEADER}
            </Typography>

            <Typography variant="text" sx={{ ...sx.text1, my: 2 }}>
              Sale has ended!
            </Typography>

            <Box sx={sx.roleContainer}>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{maxToken}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  {project.name}
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{sold}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  Sold
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Box display="flex">
                  <img src={ethIcon} style={sx.img} alt="Eth" />
                  <Typography sx={sx.saleText}>{price}</Typography>
                </Box>
                <Typography sx={{ ...sx.saleSubText, ml: 2 }} gutterBottom>
                  Price
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3} sx={sx.btnsContainer}>
              <Grid item xs="auto">
                <Button variant="contained" sx={sx.mintBtn} disabled={true}>
                  Sold Out
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }
    //sale pending
    else if( !( contractConfig.isClaimActive || contractConfig.isPresaleActive || contractConfig.isMainsaleActive ) ){
      return (
        <Card sx={sx.root}>
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
            Minting is not live yet, check back soon...
          </Box>
        </Card>
      );
    }


    const cards = [];
    if( contractConfig.isClaimActive ){
      cards.push(
        <div key="isClaimActive">Claim Here</div>
      );
    }

    //TODO: need signatures
    if( contractConfig.isPresaleActive ){
      cards.push(
        <Card key="isPresaleActive" sx={sx.root}>
          <CardContent sx={sx.cardContent}>
            <Typography variant="heading1" sx={sx.title}>
              {PRESALE_HEADER}
            </Typography>

            <Typography variant="text" sx={{ ...sx.text1, my: 2 }}>
              {/*project.id === 'toddlerpillars' ? (
                <>
                  Connect your wallet and if you are part of the whitelist you will be
                  able to mint {`${project.name}`}. You can check the full set of
                  conditions on our <TextLink onClick={gotoRoadmap}>Roadmap</TextLink>{" "}
                  page.{" "}
                  {communityActive
                    ? "Presale is currently open for:"
                    : <Typography component="span" color="red">Presale will start soon.</Typography>}
                </>
              ) : null */}

              {project.id === 'chimerapillars' ? (
                <>
                  Only wallets holding <a style={{ textDecoration: 'underline', color: colors.primary, fontWeight: '700' }} href="https://opensea.io/collection/toddlerpillars" target="_blank">Toddlerpillars</a> can mint during presale. <a style={{ textDecoration: 'underline', color: colors.primary, fontWeight: '700' }} href="https://opensea.io/collection/toddlerpillars" target="_blank">Adopt one now!</a> <strong>Mint multiples for upcoming merge & burn utility!</strong> Presale runs from May 16 - May 22. Public sale for non TP holders begins May 23.
                </>
              ) : null}
            </Typography>

            <Box sx={sx.roleContainer}>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{contractConfig.maxSupply}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  {project.name}
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{contractConfig.totalSupply}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  Sold
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Box display="flex">
                  <img src={ethIcon} style={sx.img} alt="Eth" />
                  <Typography sx={sx.saleText}>{contractConfig.ethPrice}</Typography>
                </Box>
                <Typography sx={{ ...sx.saleSubText, ml: 2 }} gutterBottom>
                  Price
                </Typography>
              </Box>
            </Box>

            {ownerConfig.toddlers ? (
              <Grid container spacing={3} sx={sx.btnsContainer}>
                <Grid item xs="auto">
                  <Button
                    variant="contained"
                    sx={sx.mintBtn}
                    onClick={handleMintClicked}
                    disabled={disableMintBtn}
                  >
                    Mint NFT
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  {!address && (
                    <Button
                      variant="outlined"
                      sx={sx.connectBtn}
                      onClick={handleConnect}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Grid>
              </Grid>
            ):(
              <Typography sx={sx.errorText}>
                Sorry, your wallet address doesn’t have permission to mint yet,
                but don’t worry the public sale will start soon.
              </Typography>
            )}
            {ownerConfig.purchased >= 4 && (
              <Typography sx={sx.errorText}>
                Sorry, your wallet address doesn’t have permission to mint more
                tokens in presale, but don’t worry, the public sale will start
                soon.
              </Typography>
            )}
          </CardContent>
        </Card>
      );
    }

    if( contractConfig.isMainsaleActive ){
      cards.push(
        <Card key="isMainsaleActive" sx={sx.root}>
          <CardContent sx={sx.cardContent}>
            <Typography variant="heading1" sx={sx.title}>
              {SALE_HEADER}
            </Typography>

            <Typography variant="text" sx={{ ...sx.text1, my: 2 }}>
              {project.id === 'toddlerpillars' ? (
                <>
                  {`Connect your wallet and you will be able to mint ${project.name}.`}
                </>
              ) : null}

              {project.id === 'chimerapillars' ? (
                <>
                  Mint multiple Chimerapillars for our upcoming merge and burn utility. Holders will select their favourite traits from 2 NFTs and merge them into 1 while reducing the supply with a burn mechanism.
                </>
              ) : null}
            </Typography>

            <Box sx={sx.roleContainer}>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{contractConfig.maxSupply}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  {project.name}
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Typography sx={sx.saleText}>{contractConfig.totalSupply}</Typography>
                <Typography sx={sx.saleSubText} gutterBottom>
                  Sold
                </Typography>
              </Box>
              <Box component="span" sx={sx.mintRole} gutterBottom>
                <Box display="flex">
                  <img src={ethIcon} style={sx.img} alt="Eth" />
                  <Typography sx={sx.saleText}>{contractConfig.ethPrice}</Typography>
                </Box>
                <Typography sx={{ ...sx.saleSubText, ml: 2 }} gutterBottom>
                  Price
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3} sx={sx.btnsContainer}>
              <Grid item xs="auto">
                <Button
                  variant="contained"
                  sx={sx.mintBtn}
                  onClick={handleMintClicked}
                  disabled={!address || !isCorrectNetwork}
                >
                  Mint NFT
                </Button>
              </Grid>

              <Grid item xs="auto">
                {!address && (
                  <Button
                    variant="outlined"
                    sx={sx.connectBtn}
                    onClick={handleConnect}
                  >
                    Connect Wallet
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }

    return cards;
  };

  return render();
};

/* eslint-disable react/forbid-prop-types */
SaleCard.propTypes = {
  setConfigs: PropTypes.any.isRequired,
  setCheckoutVisible: PropTypes.any.isRequired,
  setMainSaleStarted: PropTypes.any.isRequired,
};

export default SaleCard;
