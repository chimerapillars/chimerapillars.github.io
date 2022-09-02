// Core deps.
import React, { useEffect, useState, useContext } from 'react'

// Third-party deps.
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'
import ImageMapper from 'react-image-mapper'
import { ethers } from 'ethers'
import _ from 'lodash'

// Local deps.
import Web3Ctx from './Context/Web3Ctx'
import { useChimeraContract } from '../hooks/useContract'
import { SpinnerDotted } from 'spinners-react'

import Divider from './common/Divider'
import config from '../config'

import Card from './Card.jsx'

const BP1 = '@media (max-width: 899px)'
const BP2 = '@media (max-width: 719px)'

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
        margin: '32px auto',
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
      padding: 4,
      marginBottom: 24,
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
      alignItems: 'center',
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
      // width: '33%',
      marginRight: '18px',
      flexShrink: 0,
      color: colors.primary,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      lineHeight: '32px',
      fontSize: '1.1rem',
    },
    accordionDescription: {
      color: colors.text,
      lineHeight: '32px',
    },
    accordionDetails: {
      borderTop: `1px solid #333`,
      padding: 2,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    stepButton: {
      '&.Mui-disabled': {
        background: colors.text,
        color: colors.background,
        opacity: 0.5,
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
    trait_type: 'EYES',
    filePrefix: 'Eyes',
    coords: '465,303,404,306,362,326,340,371,355,419,396,441,432,426,461,406,492,407,536,432,582,444,613,426,632,388,630,354,588,321,519,304',
  },
  {
    trait_type: 'MUZZLE',
    filePrefix: 'Muzzle',
    coords: '457,393,421,416,366,432,352,482,379,524,430,531,480,532,556,533,604,516,597,467,544,434,502,395',
  },
  {
    trait_type: 'HEAD',
    filePrefix: '',
    coords: '282,169,271,270,291,393,330,511,395,540,498,548,618,534,680,482,705,421,742,305,715,203,600,175,510,151,391,159',
  },
  {
    trait_type: 'Upper Torso Traits',
    filePrefix: 'UT',
    coords: '436,580,389,592,360,646,351,679,340,745,356,785,388,804,437,786,459,745,472,688,487,636,481,591',
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
    coords: [
      '377,546,310,525,219,463,197,476,165,501,156,520,190,558,217,602,276,642,316,667',
      '636,546,608,574,602,614,615,663,660,678,723,657,777,617,847,573,862,534,831,505,797,482,747,499,690,532',
    ],
  },
  {
    trait_type: 'ARMS MIDDLE PARTS',
    filePrefix: 'AM',
    coords: [
      '310,699,263,684,181,650,144,641,135,683,149,733,179,760,242,798,294,819,327,831,309,771',
      '642,696,617,727,618,783,627,816,660,826,726,808,787,783,827,753,842,707,828,673,795,669,738,688,686,696',
    ],
  },
  {
    trait_type: 'ARMS LOWER PARTS',
    filePrefix: 'AL',
    coords: [
      '326,851,262,865,205,859,151,840,118,868,105,892,99,917,112,944,152,961,210,979,249,988,287,989,302,955,299,907',
      '650,844,614,852,594,906,597,957,616,973,680,980,738,972,807,941,844,907,847,873,825,838,779,855,709,855',
    ],
  },
  {
    trait_type: 'BACKGROUNDS',
    filePrefix: 'BG',
    coords: '0,0,1000,1000',
  },
]

const MergeAndBurn = () => {
  const { handleConnect, address: account } = useContext(Web3Ctx)
  const [ loading, setLoading ] = useState(false)
  const [ burnCount, setBurnCount ] = useState(0)
  const [ tokens, setTokens ] = useState([])
  const [ activeAttribute, setActiveAttribute ] = useState(null)
  const [ newToken, setNewToken ] = useState(null)
  const [ step, setStep ] = useState('connect')
  const chimeras = useChimeraContract()

  const selectedTokens = tokens.filter(token => token.isSelected)
  const primaryToken = selectedTokens[0]
  const secondaryToken = selectedTokens[1]
  const primarySpecies = primaryToken?.attributes.find(a => a.trait_type === 'HEAD').value
  const secondarySpecies = secondaryToken?.attributes.find(a => a.trait_type === 'HEAD').value
  const isCrossSpecies = primarySpecies !== secondarySpecies

  useEffect(() => {
    if (account) {
      syncWeb3()
      setStep('selection')
    } else {
      setTokens([])
      setStep('connect')
    }
  }, [account])

  const selectToken = (selectedToken) => {
    setTokens(tokens => tokens.map((token) => {
      if (selectedToken?.id === token.id) {
        return {
          ...token,
          isSelected: !token.isSelected,
        }
      }
      return token
    }))
  }

  const syncWeb3 = async () => {
    setLoading(true)

    let resp
    let json

    // Get collection stats.
    resp = await fetch(`https://api.opensea.io/api/v1/collection/chimera-pillars`, {
      headers: {
        'x-api-key': process.env.REACT_APP_OPENSEA_API_KEY,
      }
    })
    json = await resp.json()
    const stats = json?.collection?.traits
    console.log(stats)

    // Contract info.
    const totalSupply = await chimeras.totalSupply()

    // Get tokens.
    let tokens = []
    let tokenIds = await chimeras.walletOfOwner(account)
    tokenIds = tokenIds.map(tokenId => tokenId.toNumber())
    tokenIds.push(144, 503, 16, 123, 877)

    console.log(chimeras)

    resp = await fetch(`http://localhost:3000/api/ownedPillars`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: account,
        tokenIds: tokenIds.join(','),
      }),
    })
    json = await resp.json()

    if (json?.pillars?.length) {
      tokens = json.pillars.map((pillar) => {
        const { traitTypes, ...token } = pillar

        return {
          ...token,
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

    // await Promise.all(tokenIds.map((tokenId) => {
    //   return new Promise(async (resolve, reject) => {
    //     const req = await fetch(`https://fvbogq5bv5.execute-api.us-east-1.amazonaws.com/prod/metadata/0x6f3B255eFA6b2d4133c4F208E98E330e8CaF86f3/${tokenId}`)
    //     const token = await req.json()
    //     tokens.push({
    //       id: tokenId,
    //       ...token
    //     })
    //     resolve()
    //   })
    // }))

    console.log(tokens)

    setTokens(tokens)

    // Get burn count.
    const burnEvents = await chimeras.queryFilter(chimeras.filters.Transfer(null, ethers.constants.AddressZero), 0)

    console.log(burnEvents)

    setBurnCount(burnEvents.length)

    setLoading(false)
  }

  // Swap attributes between selected tokens.
  const swapAttribute = (layer) => {
    const primaryAttr = primaryToken.attributes.find(attr => attr.trait_type === layer)
    const secondaryAttr = secondaryToken.attributes.find(attr => attr.trait_type === layer)

    console.log({layer, isCrossSpecies})
    if (layer === 'HEAD' && isCrossSpecies) {
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
  const goToStep = (step) => (evt, isExpanded) => {
    setStep(isExpanded ? step : false);
  }

  return (
    <Box sx={sx.root}>
      <Box sx={sx.content}>
        <Typography variant="heading1" sx={sx.title}>
          Merge & Burn
        </Typography>

        <Divider titleDivider />

        <Typography variant="text" sx={{ mt: 4 }}>
          Pick your favorite attributes to make your own Chimerapillar!
          <br/>
          In order to swap eyes & muzzles, the two selected Chimerapillars must be of the same species.
          <br/>
          <br/>
          So far {burnCount} Chimerapillars have been burned.
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <SpinnerDotted color={colors.primary} />
        </Box>
      )}

      <Accordion
        // disabled={!!account}
        expanded={step === 'connect'}
        onChange={goToStep('connect')}
        sx={sx.accordion}
      >
        <AccordionSummary
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
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          <Button
            variant="outlined"
            sx={sx.connectBtn}
            onClick={handleConnect}
          >
            Connect Wallet
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!account}
        expanded={step === 'selection'}
        onChange={goToStep('selection')}
        sx={sx.accordion}
      >
        <AccordionSummary
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
            Select two Chimerapillars to begin swapping parts.
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              marginBottom: 48,
            }}
          >
            {tokens.map((token) => {
              return (
                <Button
                  key={token.id}
                  disabled={!token.isSelected && selectedTokens.length === 2}
                  onClick={() => {
                    selectToken(token)
                  }}
                  style={{
                    ...sx.token,
                    ...(token.isSelected ? sx.tokenSelected : null),
                  }}
                >
                  <img
                    src={token.image}
                    width="240"
                    height="240"
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
          </div>

          <div
            style={sx.buttonContainer}
          >
            <Button
              variant="contained"
              disabled
              sx={sx.stepButton}
            >
              ‹ Back
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
              Next ›
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!account || selectedTokens.length !== 2}
        expanded={step === 'build'}
        onChange={goToStep('build')}
        sx={sx.accordion}
      >
        <AccordionSummary
          sx={sx.accordionSummary}
        >
          <Typography
            sx={sx.accordionTitle}
          >
            <span
              style={sx.accordionNumber}
            >
              3
            </span>

            <span>
              Build your new Chimerapillar
            </span>
          </Typography>

          <Typography
            sx={sx.accordionDescription}
          >
            Swap parts between your Chimerapillars.
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          {newToken && (
            <>
              <Box style={{position: 'relative', width: 1000, height: 1000, margin: 'auto', marginBottom: 24, }}>
                <ImageMapper
                  src={newToken.image}
                  imageWidth={2000}
                  width={1000}
                  onClick={(area) => {
                    swapAttribute(area._id)
                  }}
                  map={{
                    name: 'image-map',
                    areas: layers.map((layer) => {
                      const coords = Array.isArray(layer.coords) ? layer.coords : [layer.coords]
                      return {
                        _id: layer.trait_type,
                        shape: 'poly',
                        coords: coords[0].split(','),
                      }
                    }),
                  }}
                />

                {newToken.attributes.map((attr) => {
                  const layer = layers.find(layer => layer.trait_type === attr.trait_type)
                  const headType = newToken.attributes.find(attr => attr.trait_type === 'HEAD').value

                  let filepath = `${layer.filePrefix} ${attr.value}.png`
                  if (attr.trait_type === 'HEAD') {
                    filepath = filepath.replace('.png', ' Head.png').trim()
                  }
                  if (['EYES', 'MUZZLE'].includes(attr.trait_type)) {
                    filepath = `${headType} ${_.upperFirst(attr.trait_type)}/${headType} ${filepath}`
                  }

                  return (
                    <img
                      src={`/chimerapillars/parts/resized/${attr.trait_type}/${filepath}`}
                      width="1000"
                      height="1000"
                      style={{position: 'absolute', top: 0, left: 0}}
                    />
                  )
                })}

                {/*}<map
                  name="image-map"
                >
                  {layers.map((layer) => {
                    const coords = Array.isArray(layer.coords) ? layer.coords : [layer.coords]
                    const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)

                    if (isCrossSpecies && ['EYES', 'MUZZLE'].includes(layer.trait_type)) {
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
                  width: 1016,
                  margin: '0 auto 32px auto',
                }}
              >
                {layers.map((layer) => {
                  const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)

                  return (
                    <div
                      key={layer.trait_type}
                      onClick={() => swapAttribute(attr.trait_type)}
                      style={{
                        cursor: 'pointer',
                        margin: 8,
                        width: 187,
                        borderRadius: 8,
                        padding: 8,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${colors.primary}`,
                        background: attr?.trait_type === activeAttribute?.trait_type
                          ? colors.highlight
                          : 'rgba(21, 178, 229, 0.06)',
                        opacity: isCrossSpecies && ['EYES', 'MUZZLE'].includes(layer.trait_type)
                          ? 0.5
                          : 1,
                        pointerEvents: isCrossSpecies && ['EYES', 'MUZZLE'].includes(layer.trait_type)
                          ? 'none'
                          : 'auto',
                      }}
                    >
                      <span style={{ fontSize: '0.8em', color: colors.primary, fontWeight: '600', }}>{attr.trait_type.toUpperCase()}</span>
                      <span style={{ color: 'white', fontWeight: 'bold', display: 'block', minHeight: '3em' }}>{attr.value}</span>
                      <span style={{ fontSize: '0.8em', color: 'rgb(138, 147, 155)', }}>{attr.rarity}% have this trait</span>
                    </div>
                  )
                })}
              </div>

              <div
                style={sx.buttonContainer}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    goToStep('selection')
                  }}
                  sx={sx.stepButton}
                >
                  ‹ Back
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    setStep('confirm')
                  }}
                  sx={sx.stepButton}
                >
                  Next ›
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
      >
        <AccordionSummary
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
            Confirm your choices and create your new Chimerapillar.
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={sx.accordionDetails}
        >
          <Typography>
            Are you 100% sure about all this? IMAGE OF FINAL CHIMERA / UI TO SELECT WHICH # TO KEEP
          </Typography>

          <Button
            variant="outlined"
            sx={sx.connectBtn}
            onClick={handleConnect}
          >
            MERGE & BURN
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default MergeAndBurn
