import React, { useEffect, useState, useContext } from "react"
import Web3Ctx from "./Context/Web3Ctx"
import { Box, Typography, Grid, Button } from "@mui/material"
import _ from 'lodash'

import { useChimeraContract } from "../hooks/useContract"
import { SpinnerDotted } from "spinners-react"

import Divider from "./common/Divider"
import config from '../config'

import Card from './Card.jsx'

const BP1 = "@media (max-width: 899px)"
const BP2 = "@media (max-width: 719px)"

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
        margin: 'auto',
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
            backgroundColor: colors.primary,
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
      padding: 0,
      border: '4px solid',
      outline: 'none',
      borderColor: 'transparent',
    },
    tokenSelected: {
      background: 'none',
      padding: 0,
      borderColor: colors.primary,
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
  const { handleConnect, address } = useContext(Web3Ctx)
  const [ loading, setLoading ] = useState(false)
  const [ tokens, setTokens ] = useState([])
  // const [selectedTokens, setSelectedTokens] = useState([])
  const [ activeAttribute, setActiveAttribute ] = useState(null)
  const [ newToken, setNewToken ] = useState(null)
  const chimeras = useChimeraContract()

  useEffect(() => {
    if (address) {
      getTokens()
      getBurnCount()
      // setPrimaryToken(null)
      // setSecondaryToken(null)
    }
  }, [address])

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

  const setPrimaryToken = (selectedToken) => {
    setTokens(tokens => tokens.map((token) => {
      console.log({ selected: selectedToken?.id, token: token.id }, selectedToken?.id === token.id)
      return {
        ...token,
        isPrimary: selectedToken?.id === token.id,
        isSecondary: false,
      }
    }))

    setNewToken(selectedToken)
  }

  const setSecondaryToken = (selectedToken) => {
    setTokens(tokens => tokens.map((token) => {
      return {
        ...token,
        isPrimary: false,
        isSecondary: selectedToken?.id === token.id,
      }
    }))
  }

  const getTokens = async () => {
    setLoading(true)

    let tokenIds = await chimeras.walletOfOwner(address)
    tokenIds = tokenIds.map(tokenId => tokenId.toNumber())
    tokenIds.push(144, 484, 16)

    const tokens = []
    await Promise.all(tokenIds.map((tokenId) => {
      return new Promise(async (resolve, reject) => {
        const req = await fetch(`https://fvbogq5bv5.execute-api.us-east-1.amazonaws.com/prod/metadata/0x6f3B255eFA6b2d4133c4F208E98E330e8CaF86f3/${tokenId}`)
        const token = await req.json()
        tokens.push({
          id: tokenId,
          ...token
        })
        resolve()
      })
    }))

    console.log(tokens)

    setTokens(_.orderBy(tokens, 'id'))

    setLoading(false)
  }

  const getBurnCount = async () => {
    console.log(chimeras)
    // const burnCount = await chimeras.queryFilter(chimeras.filters.burnFrom(), 0)

    // console.log(burnCount)
  }

  // const primaryToken = tokens.find(token => token.isPrimary)
  // const secondaryToken = tokens.find(token => token.isSecondary)

  const swapAttribute = (layer) => {
    return (evt) => {
      evt.preventDefault()
      evt.stopPropagation()

      const primaryAttr = tokens[2].attributes.find(attr => attr.trait_type === layer)
      const secondaryAttr = tokens[3].attributes.find(attr => attr.trait_type === layer)

      setNewToken({
        ...newToken,
        attributes: newToken.attributes.map(attr => {
          if (attr.trait_type === layer) {
            return attr.value === primaryAttr.value ? secondaryAttr : primaryAttr
          }
          return attr
        })
      })

      setActiveAttribute(activeAttribute?.value === primaryAttr.value ? secondaryAttr : primaryAttr)
    }
  }

  return (
    <Box sx={sx.root}>
      <Box sx={sx.content}>
        <Typography variant="heading1" sx={sx.title}>
          Merge & Burn
        </Typography>

        <Divider titleDivider />

        <Typography variant="text" sx={{ mt: 4 }}>
          Pick your favorite attributes to make your own Chimerapillar.
        </Typography>

        {!address && (
          <Box>
            <Typography variant="text" sx={{ my: 4 }}>
              Connect your wallet to see your bebehs.
            </Typography>

            <Button
              variant="outlined"
              sx={sx.connectBtn}
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          </Box>
        )}
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <SpinnerDotted color={colors.primary} />
        </Box>
      )}

      {address && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 48,
            }}
          >
            {tokens.map((token) => {
              console.log(token)
              return (
                <div
                  key={token.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Button
                    onClick={() => {
                      selectToken(token)
                    }}
                    style={{
                      ...sx.token,
                      ...(token.isSelected ? sx.tokenSelected : null),
                      marginBottom: 12,
                      padding: 4,
                    }}
                  >
                    <Typography
                      style={{
                        lineHeight: '2',
                        fontWeight: 'bold',
                      }}
                    >
                      {token.name}
                    </Typography>

                    <img
                      src={token.image}
                      width="240"
                      height="240"
                    />
                  </Button>

                  {token.isSelected && (tokens.filter(t => t.isSelected)).length === 2 && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setPrimaryToken(token)
                        // setSecondaryToken(tokens[1])
                      }}
                      style={{
                        // display: 'block',
                        backgroundColor: token.isPrimary ? colors.highlight : 'white',
                        color: token.isPrimary ? 'white' : colors.highlight,
                        fontWeight: 'bold',
                      }}
                    >
                      Make Primary
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          {newToken && (
            <>
              <Box style={{position: 'relative', width: 1000, height: 1000, margin: 'auto', marginBottom: 24, }}>
                <img
                  src={newToken.image}
                  useMap="#image-map"
                  width="1000"
                  height="1000"
                  style={{opacity: 0, position: 'absolute', top: 0, left: 0, zIndex: 2}}
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

                <map
                  name="image-map"
                >
                  {layers.map((layer) => {
                    const coords = Array.isArray(layer.coords) ? layer.coords : [layer.coords]
                    const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)

                    return (
                      <>
                        {coords.map((coord) => (
                          <area
                            onClick={swapAttribute(layer.trait_type)}
                            title={`${attr?.trait_type}: ${attr?.value}`}
                            coords={coord}
                            shape={coord.split(',').length === 4 ? 'rect' : 'poly'}
                          />
                        ))}
                      </>
                    )
                  })}
                </map>
              </Box>

              {newToken && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: 1016,
                    margin: 'auto',
                  }}
                >
                  {layers.map((layer) => {
                    const attr = newToken?.attributes?.find(attr => attr.trait_type === layer.trait_type)

                    return (
                      <div
                        onClick={swapAttribute(attr.trait_type)}
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
                        }}
                      >
                        <span style={{ fontSize: '0.8em', color: colors.primary, fontWeight: '600', }}>{attr.trait_type.toUpperCase()}</span>
                        <span style={{ color: 'white', fontWeight: 'bold', display: 'block', minHeight: '3em' }}>{attr.value}</span>
                        <span style={{ fontSize: '0.8em', color: 'rgb(138, 147, 155)', }}>X% have this trait</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default MergeAndBurn
