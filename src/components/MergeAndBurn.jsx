// Core deps.
import React, { useEffect, useState, useContext, useRef } from 'react'

// Third-party deps.
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'
import Modal from 'react-modal'
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import ImageMapper from 'react-image-mapper'
import { ethers } from 'ethers'
import { ECAddress } from 'ec-commons';
import toast from 'react-hot-toast'
import { useMediaQuery } from '@react-hook/media-query'
import _ from 'lodash'

// Local deps.
import Web3Ctx from './Context/Web3Ctx'
import { useChimeraContract, useChimeraBurnerContract } from '../hooks/useContract'
import { SpinnerDotted } from 'spinners-react'

import Divider from './common/Divider'
import config from '../config'

import Card from './Card.jsx'

const BP1 = '@media (max-width: 899px)'
const BP2 = '@media (max-width: 767px)'

const { colors } = config.PROJECT

const sx = {
    root: {
        height: '100%',
        backgroundColor: colors.background,
        py: '44px',
        position: 'relative',
        transition: 'all .3s',
        [BP1]: {
            px: '85px',
        },
        [BP2]: {
            px: '24px',
        },
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'top',
        textAlign: 'center',
        gap: '0 25px',
        mb: 4,
    },
    connectBtn: {
        fontSize: 16,
        minWidth: '150px',
        height: '40px',
        backgroundColor: colors.background,
        color: colors.primary,
        borderRadius: '22px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'roboto-bold',
        transition: 'all .3s',
        textTransform: 'unset',
        '&:focus': {
            backgroundColor: colors.primary,
            color: '#fff',
            outlineColor: '#000',
            opacity: 0.8,
        },
        '&:disabled': {
            backgroundColor: 'primary.main',
            cursor: 'not-allowed',
            opacity: 0.5,
        },
        '&:hover': {
            backgroundColor: colors.highlight,
            color: '#fff',
            borderColor: colors.primary,
        },
        '&:active': {
            outlineColor: 'unset',
        },
    },
    mergeBtn: {
      '&.Mui-disabled': {
        background: colors.text,
        color: colors.background,
      },
    },
    disconnectBtn: {
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'color 0.3s ease-in-out',
      marginLeft: '6px',
      fontSize: '0.8rem',
      lineHeight: '0.3rem',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    errorBtn: {
      color: '#fff',
      fontSize: 16,
      minWidth: '150px',
      height: '40px',
      backgroundColor: 'red',
      borderRadius: '22px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'roboto-bold',
      transition: 'all .3s',
      textTransform: 'unset',
    },
    tokens: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    token: {
      display: 'flex',
      flexDirection: 'column',
      background: 'none',
      border: '4px solid',
      outline: 'none',
      borderColor: 'transparent',
      padding: '4px',
      marginBottom: '24px',
      '&.Mui-disabled': {
        color: colors.text,
      },
    },
    tokenSelected: {
      background: 'none',
      borderColor: colors.primary,
    },
    accordion: {
      background: '#1f1e1e',
      marginBottom: 2,
      '&.Mui-disabled': {
        background: '#1f1e1e',
        opacity: 0.75,
      },
    },
    accordionSummary: {
      display: 'flex',
      alignItems: 'center',
      [BP2]: {
        display: 'block',
      },
    },
    accordionNumber: {
      display: 'flex',
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.highlight,
      marginRight: 12,
      borderRadius: '100%',
      color: colors.text,
    },
    accordionTitle: {
      marginRight: '18px',
      flexShrink: 0,
      color: colors.primary,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.1rem',
    },
    accordionDescription: {
      color: colors.text,
      [BP2]: {
        marginLeft: '45px',
      },
    },
    accordionDetails: {
      borderTop: `1px solid #333`,
      padding: 2,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 8,
      background: '#1f1e1e',
    },
    stepButton: {
      '&.Mui-disabled': {
        background: colors.text,
        color: colors.background,
        opacity: 0.5,
      },
    },
    modalHeading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    modalCopy: {
      marginBottom: 24,
    },
    modalCancel: {
      color: colors.text,
      fontSize: '0.9em',
      textTransform: 'none',
      '&:hover': {
        color: colors.text,
        background: 'transparent',
        textDecoration: 'underline',
      },
      '&:active': {
        color: colors.text,
        background: 'transparent',
      },
      '&.Mui-disabled': {
        color: colors.text,
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
}

const layers = [
  {
    trait_type: 'Crown',
    filePrefix: 'CROWN',
    coords: '265,91,317,172,388,225,474,242,598,226,677,190,752,99,784,0,588,0,367,-1,238,-1',
  },
  {
    trait_type: 'Upper Torso Traits',
    filePrefix: 'UT',
    coords: '436,580,389,592,360,646,351,679,340,745,356,785,388,804,437,786,459,745,472,688,487,636,481,591',
  },
  {
    trait_type: 'MUZZLE',
    filePrefix: 'Muzzle',
    coords: '457,393,421,416,366,432,352,482,379,524,430,531,480,532,556,533,604,516,597,467,544,434,502,395',
  },
  {
    trait_type: 'EYES',
    filePrefix: 'Eyes',
    coords: '465,303,404,306,362,326,340,371,355,419,396,441,432,426,461,406,492,407,536,432,582,444,613,426,632,388,630,354,588,321,519,304',
  },
  {
    trait_type: 'HEAD',
    filePrefix: '',
    coords: '282,169,271,270,291,393,330,511,395,540,498,548,618,534,680,482,705,421,742,305,715,203,600,175,510,151,391,159',
  },
  {
    trait_type: 'Upper Torso Parts',
    filePrefix: 'UT',
    coords: '472,554,405,548,373,556,333,614,313,693,311,767,326,827,366,861,425,856,487,832,556,814,620,827,624,721,610,661,598,590,617,559,579,545',
  },
  {
    trait_type: 'Lower Torso Traits',
    filePrefix: 'LT',
    coords: '440,887,390,883,343,897,323,935,340,963,390,976,422,974,465,965,491,953,493,922,473,897',
  },
  {
    trait_type: 'LOWER TORSO PARTS',
    filePrefix: 'LT',
    coords: '300,999,301,941,309,886,335,840,362,860,419,860,468,839,539,821,614,828,613,857,583,912,599,971,652,982,662,999',
  },
  {
    trait_type: 'ARM R1 TRAITS',
    filePrefix: 'ARM R1',
    coords: '209,237,251,305,259,384,231,472,162,508,78,494,26,442,9,339,27,247,85,204,144,198',
  },
  {
    trait_type: 'ARMS R2 TRAITS',
    filePrefix: 'ARM R2',
    coords: '159,635,142,591,89,550,35,563,9,625,7,690,35,737,88,754,136,734,150,695',
  },
  {
    trait_type: 'ARMS R3 TRAITS',
    filePrefix: 'ARM R3',
    coords: '186,865,167,814,128,773,61,767,20,794,6,866,11,934,34,987,98,992,161,986,182,932',
  },
  {
    trait_type: 'ARM L1 TRAITS',
    filePrefix: 'ARM L1',
    coords: '786,470,785,406,787,315,805,230,835,121,872,81,924,88,961,137,988,218,997,372,998,453,987,520,930,559,869,546',
  },
  {
    trait_type: 'ARMS L2 TRAITS',
    filePrefix: 'ARM L2',
    coords: '815,700,813,657,839,614,888,594,930,598,966,618,975,684,967,727,926,778,871,785,826,760',
  },
  {
    trait_type: 'ARMS L3 TRAITS',
    filePrefix: 'ARM L3',
    coords: '809,826,850,792,905,790,962,809,988,851,989,923,970,970,924,988,863,986,811,946,800,886',
  },
  {
    trait_type: 'ARMS TOP PARTS',
    filePrefix: 'AT',
    coords: '377,546,310,525,219,463,197,476,165,501,156,520,190,558,217,602,276,642,316,667',
  },
  {
    trait_type: 'ARMS TOP PARTS',
    filePrefix: 'AT',
    coords: '636,546,608,574,602,614,615,663,660,678,723,657,777,617,847,573,862,534,831,505,797,482,747,499,690,532',
  },
  {
    trait_type: 'ARMS MIDDLE PARTS',
    filePrefix: 'AM',
    coords: '310,699,263,684,181,650,144,641,135,683,149,733,179,760,242,798,294,819,327,831,309,771',
  },
  {
    trait_type: 'ARMS MIDDLE PARTS',
    filePrefix: 'AM',
    coords: '642,696,617,727,618,783,627,816,660,826,726,808,787,783,827,753,842,707,828,673,795,669,738,688,686,696',
  },
  {
    trait_type: 'ARMS LOWER PARTS',
    filePrefix: 'AL',
    coords: '326,851,262,865,205,859,151,840,118,868,105,892,99,917,112,944,152,961,210,979,249,988,287,989,302,955,299,907',
  },
  {
    trait_type: 'ARMS LOWER PARTS',
    filePrefix: 'AL',
    coords: '650,844,614,852,594,906,597,957,616,973,680,980,738,972,807,941,844,907,847,873,825,838,779,855,709,855',
  },
  {
    trait_type: 'BACKGROUNDS',
    filePrefix: 'BG',
    coords: '0,0,1000,1000',
  },
]

const MergeAndBurn = () => {
  const { handleConnect, handleDisconnect, isCorrectNetwork, address: account, wallet } = useContext(Web3Ctx)
  const [ isConfirmationModalOpen, setIsConfirmationModalOpen ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ isProcessing, setIsProcessing ] = useState(false)
  const [ isBurnActive, setIsBurnActive ] = useState(false)
  const [ burnCount, setBurnCount ] = useState(0)
  const [ tokens, setTokens ] = useState([])
  const [ activeAttribute, setActiveAttribute ] = useState(null)
  const [ newToken, setNewToken ] = useState(null)
  const [ burnToken, setBurnToken ] = useState(null)
  const [ tempToken, setTempToken ] = useState(null)
  const [ step, setStep ] = useState('connect')
  const [ hoveredLayer, setHoveredLayer ] = useState(null)
  const accordionElem = useRef(null)
  const chimeraContract = useChimeraContract()
  const chimeraBurnerContract = useChimeraBurnerContract()
  const smallMediaQuery = useMediaQuery('(max-width: 820px)')
  const mediumMediaQuery = useMediaQuery('(min-width: 820px)')
  const largeMediaQuery = useMediaQuery('(min-width: 1481px)')

  const selectedTokens = tokens.filter(token => token.isSelected)
  const primaryToken = selectedTokens[0]
  const secondaryToken = selectedTokens[1]
  const primarySpecies = primaryToken?.attributes.find(a => a.trait_type === 'HEAD').value
  const secondarySpecies = secondaryToken?.attributes.find(a => a.trait_type === 'HEAD').value
  const isSameSpecies = primarySpecies === secondarySpecies

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    if (account) {
      syncWeb3()
      setStep('selection')
    } else {
      setTokens([])
      setNewToken(null)
      setBurnToken(null)
      setTempToken(null)
      setActiveAttribute(null)
      setHoveredLayer(null)
      setStep('connect')
    }
  }, [account])

  useEffect(() => {
    if (primaryToken?.attributes?.length) {
      layers.forEach((layer) => {
        const layerURI = getLayerURI(primaryToken, layer)
        const img = new Image()
        img.src = layerURI
      })
    }

    if (secondaryToken?.attributes?.length) {
      layers.forEach((layer) => {
        const layerURI = getLayerURI(secondaryToken, layer)
        const img = new Image()
        img.src = layerURI
      })
    }
  }, [primaryToken, secondaryToken])

  useEffect(() => {
    if (tempToken) {
      syncWeb3()
    }
  }, [tempToken])

  // useEffect(() => {
  //   if (accordionElem?.current) {
  //     accordionElem.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //       inline: 'nearest',
  //     })
  //   }
  // }, [step])

  const selectToken = (id) => {
    setTokens(tokens => tokens.map((token) => {
      if (id === token.id) {
        return {
          ...token,
          isSelected: !token.isSelected,
        }
      }
      return token
    }))
    setActiveAttribute(null)
    setHoveredLayer(null)
  }

  const syncWeb3 = async () => {
    setLoading(true)

    // Get burn count.
    const filter = chimeraContract.filters.Transfer(null, ethers.constants.AddressZero)
    const burnEvents = await chimeraContract.queryFilter(filter, 15625431)
    console.log('burns:', burnEvents.map(evt => evt.args[2].toNumber()).sort((a, b) => a - b).toString() || 'none')
    setBurnCount(burnEvents.length)

    // See if burn is active.
    const isBurnActive = await chimeraBurnerContract.isBurnActive()
    setIsBurnActive(isBurnActive)
    // Get collection stats.
    let resp
    let json
    if (config.DEPLOYED_NTW_NAME === 'goerli') {
      resp = await fetch('https://testnets-api.opensea.io/api/v1/collection/chimera-pillars-testnet')
    } else {
      resp = await fetch('https://api.opensea.io/api/v1/collection/chimera-pillars', {
        headers: {
          'x-api-key': process.env.REACT_APP_OPENSEA_API_KEY,
        }
      })
    }

    json = await resp.json()
    const stats = json?.collection?.traits
    console.log(stats)

    // Contract info.
    const totalSupply = await chimeraContract.totalSupply()

    // Get tokens.
    let tokens = []
    let tokenIds = await chimeraContract.walletOfOwner(account)
    // let tokenIds = await chimeraContract.walletOfOwner('0x7ea4238d0d43f6250bd4c7b2b48b3dc5dcd52cd4')
    tokenIds = tokenIds.map(tokenId => tokenId.toNumber())

    if (tokenIds?.length) {
      resp = await fetch(`${config.PROJECT.mergeburn.apiRoot}/ownedPillars`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: account?.toLowerCase(),
          // wallet: '0x7ea4238d0d43f6250bd4c7b2b48b3dc5dcd52cd4'?.toLowerCase(),
          tokenIds: tokenIds.join(','),
        }),
      })
      json = await resp.json()

      if (json?.pillars?.length) {
        tokens = json.pillars.map((pillar) => {
          const { traitTypes, ...token } = pillar

          if (token.tokenId === tempToken?.id) {
            return { ...tempToken, isSelected: false }
          }

          return {
            ...token,
            id: token.tokenId,
            image: `https://chimerapillars${config.DEPLOYED_NTW_NAME === 'goerli' ? '-testnet' : ''}.s3.amazonaws.com/images/${token.tokenId}.png?bust=${Date.now()}`,
            attributes: traitTypes.map(trait => {
              const percentage = (stats?.[trait.trait_type]?.[trait.value.toLowerCase()] / totalSupply.toNumber() * 100)
              return {
                ...trait,
                rarity: percentage < 1 ? percentage.toFixed(2) : Math.round(percentage),
              }
            }),
          }
        })
      }
    }

    console.log(tokens)

    setTokens(tokens)

    setLoading(false)
  }

  // Swap attributes between selected tokens.
  const swapAttribute = (layer) => {
    const primaryAttr = primaryToken.attributes.find(attr => attr.trait_type === layer)
    const secondaryAttr = secondaryToken.attributes.find(attr => attr.trait_type === layer)

    if (layer === 'HEAD' && !isSameSpecies) {
      swapAttribute('EYES')
      swapAttribute('MUZZLE')
    }

    setNewToken(currToken => ({
      ...currToken,
      attributes: currToken.attributes.map(attr => {
        if (attr.trait_type === layer) {
          return attr.value === primaryAttr.value ? secondaryAttr : primaryAttr
        }
        return attr
      })
    }))

    setActiveAttribute(activeAttribute?.value === primaryAttr.value ? secondaryAttr : primaryAttr)
  }

  // Go to specific step.
  const goToStep = (step) => async (evt, isExpanded) => {
    setStep(isExpanded ? step : false)

    // await new Promise(r => setTimeout(r, 500))
    //
    // if (accordionElem?.current) {
    //   accordionElem.current.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start',
    //     inline: 'nearest',
    //   })
    // }
  }

  // Get the URI of the layer image, based on a specified token.
  const getLayerURI = (token, layer) => {
    const attr = token.attributes.find(attr => attr.trait_type === layer.trait_type)
    const headType = token.attributes.find(attr => attr.trait_type === 'HEAD').value

    let filepath = `${layer.filePrefix} ${attr.value}.png`
    if (attr.trait_type === 'HEAD') {
      filepath = filepath.replace('.png', ' Head.png').trim()
    }
    if (['EYES', 'MUZZLE'].includes(attr.trait_type)) {
      filepath = `${headType} ${_.upperFirst(attr.trait_type.toLowerCase())}/${headType} ${filepath}`

      if (attr.value === 'Monkey Eyes Flowers') {
        filepath = filepath.replace('Monkey Eyes Monkey Eyes', 'Monkey Eyes')
      }
    }

    return `https://d1s9y2mjkt4va5.cloudfront.net/__resized__/${encodeURIComponent(attr.trait_type)}/${encodeURIComponent(filepath)}`
  }

  // Get layer position.
  const getLayerPosition = (layer) => {
    return {
      top: `${layer.center[1]}px`,
      left: `${layer.center[0]}px`,
    }
  }

  // Merge & burn.
  const mergeAndBurn = async () => {
    setIsProcessing(true)

    try {
      const resp = await fetch(`${config.PROJECT.mergeburn.apiRoot}/mergePillarsRequest`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: account?.toLowerCase(),
          baseChimeraPillarId: newToken.id,
          burnChimeraPillarId: burnToken.id,
          newTraitIds: newToken.attributes.map(attr => attr.id).join(',')
        }),
      })
      const json = await resp.json()

      if (json.code === 200 || json.code === 201) {
        const txn = await chimeraBurnerContract.burnFrom(account, [burnToken.id])

        // Log.
        console.log('burn txn', txn)

        // Pending.
        if (txn && txn.hash) {
          const txnURL = `https://${config.DEPLOYED_NTW_NAME !== 'mainnet' ? config.DEPLOYED_NTW_NAME : 'www'}.etherscan.io/tx/${txn.hash}`

          // Show message.
          toast.loading('Transaction is processing...')

          // Success.
          const receipt = await txn.wait()
          console.log(receipt)

          if (receipt && receipt.transactionHash) {
            setTokens([])

            // Set "processing token" to use in place of the as-of-yet new token.
            setTempToken({ ...newToken })

            // Reset step.
            setStep('selection')

            // Clear old tokens.
            setNewToken(null)
            setBurnToken(null)

            // Show message.
            toast.dismiss()
            toast.success('Merge & Burn successful!')
          }
        }
      } else {
        throw new Error('There was a server error.')
      }
    } catch (err) {
      console.error(err)

      // Show message.
      const message = err.reason || err.message || err
      if (!/user (denied|rejected) transaction/gi.test(message)) {
        toast.error(`Something went wrong: ${message}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const closeModal = () => {
    setIsConfirmationModalOpen(false)
  }

  const BuildToken = (props = {}) => {
    const { token } = props

    return (
      <div
        style={{
          position: 'relative',
          width: props.width,
          height: props.width,
          display: 'inline-block',
          ...props.style,
        }}
      >
        {_.uniqBy([...layers].reverse(), 'trait_type').map((layer, idx) => {
          const layerURI = getLayerURI(token, layer)

          return (
            <img
              key={`${layer.trait_type}__${idx}`}
              src={layerURI}
              width={props.width}
              height={props.width}
              style={{position: 'absolute', top: 0, left: 0}}
            />
          )
        })}
      </div>
    )
  }

  const Token = (props = {}) => {
    const { token } = props

    if (token.id === tempToken?.id) {
      return <BuildToken {...props} />
    }

    return (
      <img
        src={token.image}
        width={props.width}
        height={props.height}
        style={props.style}
      />
    )
  }

  let buildImageSize
  const buildImageSizes = {
    small: 310,
    medium: 675,
    large: 1000,
  }

  if (smallMediaQuery) {
    buildImageSize = buildImageSizes.small
  }
  if (mediumMediaQuery) {
    buildImageSize = buildImageSizes.medium
  }
  if (largeMediaQuery) {
    buildImageSize = buildImageSizes.large
  }

  console.log({buildImageSize})

  if (account && !loading && !isBurnActive) {
    return (
      <Box sx={sx.content}>
        <Typography variant="heading1" sx={sx.title}>
          Merge & Burn
        </Typography>

        <Divider titleDivider />

        <Typography variant="text" sx={{ mt: 4 }}>
          Sorry, the merge & burn is not currently active.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={sx.content}>
        <Typography variant="heading1" sx={sx.title}>
          Merge & Burn
        </Typography>

        <Divider titleDivider />

        <Typography variant="text" sx={{ mt: 4 }}>
          Customise your Chimerapillars by merging your favourite traits from two Chimerapillars into one & boost their rarity by combining rare traits. A Chimerapillar is burned with every merge, a noble sacrifice in the last stand against the Lonely Toddlerpillar.
          <br/>
          <br/>
          <a href="/#/#mint" style={{color: colors.primary, textDecoration: 'underline' }}>Mint Chimerapillars</a> & find ultra-rare traits for the ultimate merge! With 888 traits, the options are almost unlimited!
          <br/>
          <br/>
          <strong>
            {account
              ? `${burnCount} Chimerapillars have been burned so far.`
              : `Connect your wallet to see how many have been burned so far.`
            }
          </strong>
        </Typography>
      </Box>

      <Accordion
        expanded={step === 'connect'}
        onChange={goToStep('connect')}
        sx={sx.accordion}
        ref={step === 'connect' ? accordionElem : null}
      >
        <AccordionSummary>
          <Box
            sx={sx.accordionSummary}
          >
            <Typography
              sx={sx.accordionTitle}
            >
              <span
                style={sx.accordionNumber}
              >
                1
              </span>

              <span>
                Connect
              </span>
            </Typography>

            <Typography
              sx={sx.accordionDescription}
            >
              Get started by connecting your wallet.
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
          style={{ display: 'flex', padding: '32px', alignItems: 'center', justifyContent: 'center', }}
        >
          {!account && (
            <Button variant='outlined' sx={sx.connectBtn} onClick={handleConnect}>Connect Wallet</Button>
          )}
          {account && isCorrectNetwork && (
            <Box sx={sx.account} onClick={(e) => e.stopPropagation()}>
              <ECAddress address={account} short blockie scale={5} />
              <Box sx={sx.disconnectBtn} onClick={() => handleDisconnect()}>disconnect</Box>
            </Box>
          )}
          {account && !isCorrectNetwork && (
            <Box sx={sx.errorBtn}>Wrong Network</Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!account}
        expanded={step === 'selection'}
        onChange={goToStep('selection')}
        sx={sx.accordion}
        ref={step === 'selection' ? accordionElem : null}
      >
        <AccordionSummary>
          <Box
            sx={sx.accordionSummary}
          >
            <Typography
              sx={sx.accordionTitle}
            >
              <span
                style={sx.accordionNumber}
              >
                2
              </span>

              <span>
                Choose your Chimerapillars
              </span>
            </Typography>

            <Typography
              sx={sx.accordionDescription}
            >
              Select 2 Chimerapillars to merge. To customise eye & muzzle traits, both Chimerapillars must have the same head type.
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          {loading && (
            <Box sx={{ textAlign: "center", marginTop: 6 }}>
              <SpinnerDotted color={colors.primary} />
            </Box>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              marginBottom: 48,
            }}
          >
            {tokens?.length < 2 && !loading ? (
              <Typography
                style={{
                  marginTop: 32,
                }}
              >
                Sorry, you need at least 2 Chimerapillars in your wallet.
              </Typography>
            ) : (
              <>
                {tokens.map((token) => {
                  return (
                    <Button
                      key={token.id}
                      disabled={!token.isSelected && selectedTokens.length === 2}
                      onClick={() => {
                        selectToken(token.id)
                      }}
                      sx={{
                        ...sx.token,
                        ...(token.isSelected ? sx.tokenSelected : null),
                      }}
                    >
                      <Token
                        token={token}
                        width={240}
                        height={240}
                      />

                      <Typography
                        style={{
                          lineHeight: '2',
                          fontWeight: 'bold',
                        }}
                      >
                        {token.name}
                      </Typography>
                    </Button>
                  )
                })}
              </>
            )}
          </div>

          <div
            style={sx.buttonContainer}
          >
            <Button
              variant="contained"
              sx={sx.stepButton}
              onClick={() => {
                setStep('connect')
              }}
            >
              ◂ Back
            </Button>

            <Button
              variant="contained"
              disabled={selectedTokens.length !== 2}
              onClick={() => {
                setNewToken({ ...selectedTokens[0] })
                setStep('build')
              }}
              sx={sx.stepButton}
            >
              Next ▸
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!account || selectedTokens.length !== 2}
        expanded={step === 'build'}
        onChange={goToStep('build')}
        sx={sx.accordion}
        ref={step === 'build' ? accordionElem : null}
      >
        <AccordionSummary>
          <Box
            sx={{
              ...sx.accordionSummary,
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', [BP2]: { display: 'block' } }}>
              <Typography
                sx={sx.accordionTitle}
              >
                <span
                  style={sx.accordionNumber}
                >
                  3
                </span>

                <span>
                  Customise your new Chimerapillar
                </span>
              </Typography>

              <Typography
                sx={sx.accordionDescription}
              >
                Swap traits between your selected Chimerapillars.
              </Typography>
            </Box>

            {step === 'build' && (
              <Box sx={{[BP2]: { margin: '8px 0 0 36px' }}}>
                {selectedTokens.map((token) => {
                  return (
                    <Token
                      key={token.id}
                      token={token}
                      width={64}
                      height={64}
                      style={{
                        marginLeft: '8px',
                        verticalAlign: 'bottom',
                      }}
                    />
                  )
                })}
              </Box>
            )}
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          {newToken && (
            <>
              <Box
                style={{
                  position: 'relative',
                  width: buildImageSize,
                  height: buildImageSize,
                  margin: 'auto',
                  marginBottom: 24,
                }}
              >
                <ImageMapper
                  src={newToken.image}
                  imgWidth={1000}
                  width={buildImageSize}
                  fillColor="rgba(0, 0, 0, 0)"
                  strokeColor="rgba(0, 0, 0, 0)"
                  onClick={(area) => {
                    swapAttribute(area._id)
                  }}
                  // onMouseEnter={setHoveredLayer}
                  // onMouseLeave={() => setHoveredLayer(null)}
                  map={{
                    name: 'image-map',
                    areas: layers.filter(layer => isSameSpecies || !['EYES', 'MUZZLE'].includes(layer.trait_type)).map((layer) => {
                      const coords = layer.coords.split(',')

                      return {
                        _id: layer.trait_type,
                        name: layer.trait_type,
                        shape: coords.length === 4 ? 'rect' : 'poly',
                        coords,
                        fillColor: 'rgba(0, 0, 0, 0)',
                        strokeColor: 'rgba(0, 0, 0, 0)',
                      }
                    }),
                  }}
                />

                {false && hoveredLayer && (
                	<span
                	  style={{
                      position: 'absolute',
                      color: '#fff',
                      padding: '10px',
                      background: 'rgba(0,0,0,0.8)',
                      transform: 'translate3d(-50%, -50%, 0)',
                      borderRadius: '5px',
                      pointerEvents: 'none',
                      zIndex: '1000',
                      ...getLayerPosition(hoveredLayer)
                    }}
                  >
                		{hoveredLayer.name}
                	</span>
                )}

                <BuildToken
                  token={newToken}
                  width={buildImageSize}
                  height={buildImageSize}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                />

                {/*}<map
                  name="image-map"
                >
                  {layers.map((layer) => {
                    const coords = Array.isArray(layer.coords) ? layer.coords : [layer.coords]
                    const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)

                    if (!isSameSpecies && ['EYES', 'MUZZLE'].includes(layer.trait_type)) {
                      return null
                    }

                    return (
                      <>
                        {coords.map((coord) => (
                          <area
                            key={coord}
                            onClick={swapAttribute(layer.trait_type)}
                            title={`${attr?.trait_type}: ${attr?.value}`}
                            coords={coord}
                            shape={coord.split(',').length === 4 ? 'rect' : 'poly'}
                          />
                        ))}
                      </>
                    )
                  })}
                </map>*/}
              </Box>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  margin: '0 auto 32px auto',
                }}
              >
                {_.uniqBy(layers, 'trait_type').map((layer) => {
                  const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)
                  const isActive = attr?.trait_type === activeAttribute?.trait_type
                  const isDisabled = !isSameSpecies && ['EYES', 'MUZZLE'].includes(attr.trait_type)

                  if (smallMediaQuery && !isActive) return null

                  return (
                    <Box
                      key={attr.trait_type}
                      onClick={() => {
                        if (isDisabled) return
                        swapAttribute(attr.trait_type)
                      }}
                      data-tip={isDisabled
                        ? 'To customise eye & muzzle traits, both Chimerapillars<br/>must have the same head type.'//'In order to swap eyes & muzzles, the two<br/>selected Chimerapillars must be of the same species.'
                        : ''
                      }
                      sx={{
                        cursor: 'pointer',
                        margin: '8px',
                        width: '187px',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${colors.primary}`,
                        background: isActive
                          ? colors.highlight
                          : 'rgba(21, 178, 229, 0.06)',
                        opacity: isDisabled
                          ? 0.5
                          : 1,
                        [BP2]: {
                          width: '100%',
                        },
                      }}
                    >
                      <Box sx={{ fontSize: '0.8em', color: colors.primary, fontWeight: '600', }}>{attr.trait_type.toUpperCase()}</Box>
                      <Box sx={{ color: 'white', fontWeight: 'bold', display: 'block', minHeight: '3em', [BP2]: { minHeight: 0 } }}>{attr.value}</Box>
                      <Box sx={{ fontSize: '0.8em', color: 'rgb(138, 147, 155)', }}>{attr.rarity}% have this trait</Box>
                    </Box>
                  )
                })}
              </div>

              <div
                style={sx.buttonContainer}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setStep('selection')
                  }}
                  sx={sx.stepButton}
                >
                  ◂ Back
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    setStep('confirm')
                  }}
                  sx={sx.stepButton}
                >
                  Next ▸
                </Button>
              </div>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={step !== 'confirm'}
        expanded={step === 'confirm'}
        onChange={goToStep('confirm')}
        sx={sx.accordion}
        ref={step === 'confirm' ? accordionElem : null}
      >
        <AccordionSummary>
          <Box
            sx={sx.accordionSummary}
          >
            <Typography
              sx={sx.accordionTitle}
            >
              <span
                style={sx.accordionNumber}
              >
                4
              </span>

              <span>
                Merge & Burn
              </span>
            </Typography>

            <Typography
              sx={sx.accordionDescription}
            >
              Confirm your trait selection and merge them into your new Chimerapillar.
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          {selectedTokens?.length === 2 && newToken && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography>
                  Which Token ID do you want your new Chimerapillar to have?
                </Typography>

                <Select
                  options={selectedTokens.map(token => {
                    return {
                      label: `#${token.id}`,
                      value: token.id,
                    }
                  })}
                  onChange={(option) => {
                    console.log({ option })

                    setNewToken({
                      ...newToken,
                      id: option.value,
                      tokenId: option.value,
                    })
                    setBurnToken(selectedTokens.find(token => token.id !== option.value))
                  }}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      color: colors.background,
                    }),
                    container: (provided, state) => ({
                      ...provided,
                      width: 200,
                      margin: '8px auto 24px auto',
                    }),
                  }}
                />

                {newToken && burnToken && (
                  <>
                    <Divider
                      titleDivider
                      style={{
                        marginBottom: '32px',
                      }}
                    />

                    <Typography
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      You are about to merge:
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 32,
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          margin: '0 12px 8px 12px',
                        }}
                      >
                        <Token
                          token={primaryToken}
                          width={smallMediaQuery ? 110 : 160}
                          height={smallMediaQuery ? 110 : 160}
                        />
                      </div>

                      <Typography
                        style={{
                          fontSize: 32,
                        }}
                      >
                        ＋
                      </Typography>

                      <div
                        style={{
                          textAlign: 'center',
                          margin: '0 12px 8px 12px',
                        }}
                      >
                        <Token
                          token={secondaryToken}
                          width={smallMediaQuery ? 110 : 160}
                          height={smallMediaQuery ? 110 : 160}
                        />
                      </div>
                    </div>

                    <Typography
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      {`Into NEW Chimerapillar #${newToken.id}`}
                    </Typography>

                    <BuildToken
                      token={newToken}
                      width={smallMediaQuery ? 320 : 480}
                      height={smallMediaQuery ? 320 : 480}
                      style={{
                        marginBottom: 8,
                      }}
                    />

                    <Typography
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      {`NOTE: Chimerapillar #${burnToken.id} will be burnt during the merge.`}
                    </Typography>
                  </>
                )}
              </div>

              <div
                style={sx.buttonContainer}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setStep('build')
                  }}
                  sx={sx.stepButton}
                >
                  ◂ Back
                </Button>

                <Button
                  disabled={!(newToken && burnToken)}
                  variant="contained"
                  sx={sx.mergeBtn}
                  onClick={() => {
                    setTempToken(null)
                    setIsConfirmationModalOpen(true)
                  }}
                >
                  MERGE & BURN
                </Button>
              </div>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <ReactTooltip
        effect="solid"
        type="light"
        multiline
      />

      <Modal
        isOpen={isConfirmationModalOpen}
        // isOpen
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            width: smallMediaQuery ? 340 : 440,
            height: 'auto',
            maxHeight: '90vh',
            margin: 'auto',
            background: '#1f1e1e',
            color: colors.text,
            border: 'none',
            textAlign: 'center',
            inset: 'auto',
          }
        }}
      >
        {isConfirmationModalOpen && (
          <>
            {isProcessing ? (
              <>
                <Typography
                  style={sx.modalHeading}
                >
                  WAITING...
                </Typography>

                <Divider
                  titleDivider
                  style={{
                    marginBottom: '32px',
                  }}
                />

                <Box sx={{ textAlign: "center", marginBottom: '24px' }}>
                  <SpinnerDotted color={colors.primary} />
                </Box>
              </>
            ) : (
              <>
                {tempToken ? (
                  <>
                    <Typography
                      style={sx.modalHeading}
                    >
                      SUCCESS!
                    </Typography>

                    <Divider
                      titleDivider
                      style={{
                        marginBottom: '32px',
                      }}
                    />

                    <Typography
                      style={sx.modalCopy}
                    >
                      {`Here is the new merged Chimerapillar #${tempToken.id}`}
                    </Typography>

                    <BuildToken
                      token={tempToken}
                      width={smallMediaQuery ? 300 : 400}
                      height={smallMediaQuery ? 300 : 400}
                      style={{
                        margin: '0 auto 32px auto',
                      }}
                    />

                    <Button
                      variant="contained"
                      sx={sx.mergeBtn}
                      onClick={closeModal}
                    >
                      GOT IT
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography
                      style={sx.modalHeading}
                    >
                      ARE YOU SURE?
                    </Typography>

                    <Divider
                      titleDivider
                      style={{
                        marginBottom: '32px',
                      }}
                    />

                    <Typography
                      style={sx.modalCopy}
                    >
                      {`You are about to update Chimerapillar #${newToken.id} with new traits and PERMANENTLY BURN Chimerapillar #${burnToken.id}.`}
                      <br/>
                      <strong>ONCE CONFIRMED THIS CANNOT BE UNDONE!</strong>
                      <br/>
                      <br/>
                      Your sacrifice will not be in vain, the fate of humanity depends upon it...
                    </Typography>

                    <Box
                      sx={{
                        ...sx.buttonContainer,
                        position: 'static',
                        borderTop: '1px solid #333',
                        padding: '16px 0 0 0',
                        marginTop: '36px',
                        [BP2]: {
                          flexDirection: 'column-reverse',
                        },
                      }}
                    >
                      <Button
                        disabled={isProcessing}
                        href="#"
                        onClick={(evt) => {
                          evt.preventDefault()
                          setIsConfirmationModalOpen(false)
                        }}
                        sx={sx.modalCancel}
                      >
                        Wait, I'm not ready
                      </Button>

                      <Button
                        disabled={isProcessing}
                        variant="contained"
                        sx={{
                          ...sx.mergeBtn,
                          [BP2]: {
                            marginTop: '8px',
                            marginBottom: '8px',
                          }
                        }}
                        onClick={mergeAndBurn}
                      >
                        CONFIRM IN {wallet.name.toUpperCase()}
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    </>
  )
}

export default MergeAndBurn
