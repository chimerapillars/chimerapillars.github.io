import { SupportedChainId } from './chain'

export const ZOOM_ADDRESSES = {
    [SupportedChainId.MAINNET]: "0x3D4F573904B98066887332EdeF1b3f9b155e8080",
    [SupportedChainId.RINKEBY]: "0xC878B3C422BeECB879dE0a2bea01D30C88F0ccdc"
}

export const EC_ADDRESSES = {
    [SupportedChainId.MAINNET]: "0x97CA7FE0b0288f5EB85F386FeD876618FB9b8Ab8",
    [SupportedChainId.RINKEBY]: "0xAAD4475343f5150E33d6194270f04e7e5968A2f8"
}

export const TODDLER_COMMUNITY_ADDRESSES = {
    [SupportedChainId.MAINNET]: "0xf5892185807d303bd6281a3a27381b85d4e5d495",
    // in presale mode (EC & all toddlers)
    // [SupportedChainId.RINKEBY]: "0xba6D164224f1fF88c298c8fC4E93D14A360c0132",
    // in All Todlers mode
    // [SupportedChainId.RINKEBY]: "0x154417A91c3C2B94eBE8832871E73Cd3F8FAA80A",
    // Omni and Toddler mode
    // [SupportedChainId.RINKEBY]: "0xA807642A1F386f82bFB84d2E34bCbe4fa8A50884",

    [SupportedChainId.RINKEBY]: "0xB9c07e6Ab0D745a1D427Da106d1B72B16434d5c4",
}

export const TODDLER_SALE_ADDRESSES = {
    [SupportedChainId.MAINNET]: "0xd6f817fa3823038d9a95b94cb7ad5468a19727fe",
    // in presale mode (EC & all toddlers)
    // [SupportedChainId.RINKEBY]: "0x2a4FD07e683C47AD0fE27bbe268243d541e901DB",
    // in All Todlers mode
    //[SupportedChainId.RINKEBY]: "0x4cEF34f15ab7502389f8744ec9c473c5E21e7BB6",
    // Omni and Toddler mode
    // [SupportedChainId.RINKEBY]: "0xC56F21D899c0eBda485229c63209885DF16f19B0",

    //[SupportedChainId.RINKEBY]: "0xaF598c8aE1F168B4ac463b277137487919072686",

    //Squeebo: temp
    [SupportedChainId.RINKEBY]: "0x063640686813Dcd28a7a4a88B2FFb8786f1161BF",
    [SupportedChainId.GOERLI]: "0x956bf0F5cBb899CE07D5549E993f22e927574ff5",
}

export const CHIMERA_CONTRACT = {
    [SupportedChainId.MAINNET]: "0x6f3B255eFA6b2d4133c4F208E98E330e8CaF86f3",
    [SupportedChainId.GOERLI]: "0x956bf0F5cBb899CE07D5549E993f22e927574ff5",
    // [SupportedChainId.RINKEBY]: "0xBE8f6211b4D209937DF2446527f5a76Af81F3617",
}

export const CHIMERA_BURNER_CONTRACT = {
    [SupportedChainId.MAINNET]: "0x5FFF7742dAEB5C51441C5CF8e7eC803EFfda6b15",
    [SupportedChainId.GOERLI]: "0x5512247B5FCCc15Fa427c2BB12d277D724b51AA4",
    // [SupportedChainId.RINKEBY]: "0x620165CAAe5A9809DA788B81c896E409F722B7B4",
}

export const CHIMERA_MINTER_CONTRACT = {
    [SupportedChainId.MAINNET]: "0x24e7Ec43D38e0f1dA47E9FD1C0917F167B837cFE",
    [SupportedChainId.GOERLI]: "0x0f917Ee3cD9377a027Fed0DC216976Db796A32D4",
}
