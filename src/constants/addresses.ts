import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    // lwh 0x3E921a39b4D224596E4a130be690Da3c85bcF861
    // dai 0xa76cfDbEdF7883428B0e847AC354DeBA21B58CfC
    // sLWH 0x1af5a01Ec47D3092Bd63f5Ef8b5a0b6376245E94
    // test 0x2f4dB2564f1399678cc4d1F583aDC9b69936AE34
    // treasury 0x87e4E6655AE0A7a1F576E96Cd844620b77aDD5e8
    // olympusBondingCalculator 0xF4d46fAc3ad21B9F11427f169b939B366Ddfba6f
    // distributor 0x6e540b04BFa462B290C1d66cd403BB3118F35823
    // staking 0xa483923988B8283DE9e00b34db92bC5B018C7b57
    // stakingWarmup 0xeA8a261b2A8B9edb645881659039de0Ac997e20d
    // stakingHelper 0x5E91CDe2040cAaC04292359c5cee25451d42AF4a
    // daiBond 0x435De2e8782E6ECB6fBDDe3C876f75FC2DC52642
    DAO_ADDRESS: "0x5B3B6eE0ef859333Ed3c54959584Ca15060610c1",
    OHM_ADDRESS: "0x3E921a39b4D224596E4a130be690Da3c85bcF861",
    DAI_ADDRESS: "0xa76cfDbEdF7883428B0e847AC354DeBA21B58CfC",
    sOHM_ADDRESS: "0x1af5a01Ec47D3092Bd63f5Ef8b5a0b6376245E94",
    TEST_ADDRESS: "0x2f386c813Df30E877B8B9e3B3B5a52A499D58e4b",
    TREASURY_ADDRESS: "0x87e4E6655AE0A7a1F576E96Cd844620b77aDD5e8",
    STAKING_ADDRESS: "0xa483923988B8283DE9e00b34db92bC5B018C7b57",
    STAKING_HELPER_ADDRESS: "0x5E91CDe2040cAaC04292359c5cee25451d42AF4a",
    OHM_BONDING_CALC_ADDRESS: "0x38f8b06ea1a65Cf4e7917D06Ee95Ca25AF39Bf0B",
    ZAPIN_ADDRESS: "0x7C488C807eFD61929D2c330e949a06Cc638fC748",
    // WMEMO_ADDRESS: "0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.AVAX) return AVAX_MAINNET;

    throw Error("Network don't support");
};
