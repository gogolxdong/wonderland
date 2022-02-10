import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Link, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import "./referral.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText, clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "../../store/slices/pending-txns-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { error, warning, success, info } from "../../store/slices/messages-slice";
import { TestContract, TimeTokenContract } from "../../abi";
import { getAddresses } from "../../constants";
import { ethers } from "ethers";
import { IAccountSlice, fetchAccountSuccess } from "src/store/slices/account-slice";
import { Skeleton } from "@material-ui/lab";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import { SonTableData, SonDataCard } from "./ReferralRow";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import copy from "copy-to-clipboard";

function Referral() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [referral, setReferral] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isSmallScreen = useMediaQuery("(max-width: 733px)");

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });
    const account = useSelector<IReduxState, IAccountSlice>(state => {
        return state.account;
    });
    const zero = "0x0000000000000000000000000000000000000000";
    const referred = address != "" && account.referral != zero && account.referral != address;
    const addresses = getAddresses(chainID);
    if (referral == "") {
        if (address != "") {
            if (!account.registered) {
                setReferral(address);
            } else {
                setReferral(account.referral);
            }
        }
    }
    const onChangeReferral = async () => {
        if (addresses.TEST_ADDRESS) {
            try {
                const testContract = new ethers.Contract(addresses.TEST_ADDRESS, TestContract, provider.getSigner());
                var tx = await testContract.setReferral(referral);
                dispatch(
                    fetchPendingTxns({
                        txnHash: tx.hash,
                        text: "Register",
                        type: "registering",
                    }),
                );
                await tx.wait();
                dispatch(success({ text: messages.tx_successfully_send }));
                dispatch(
                    fetchAccountSuccess({
                        registered: true,
                        referral: referral,
                    }),
                );
            } catch (err: any) {
                metamaskErrorWrap(err, dispatch);
            } finally {
                if (tx) {
                    dispatch(clearPendingTxn(tx.hash));
                }
            }
        }
    };

    function partners() {
        return (
            <div className="choose-son-view">
                <Zoom in={true}>
                    <div className="choose-son-view-card">
                        <Grid container item xs={12} spacing={2} className="choose-son-view-card-metrics">
                            <Grid item xs={12} sm={6}>
                                <Box textAlign="center">
                                    <p className="choose-son-view-card-metrics-title">Partners</p>
                                    <p className="choose-son-view-card-metrics-value">{isAppLoading ? <Skeleton width="180px" /> : account.partners.length}</p>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box textAlign="center">
                                    <p className="choose-son-view-card-metrics-title">Profit</p>
                                    <p className="choose-son-view-card-metrics-value">
                                        {isAppLoading ? <Skeleton width="180px" /> : `$${account.totalProfit.toNumber() / 10 ** 9}`}
                                    </p>
                                </Box>
                            </Grid>
                        </Grid>

                        {!isSmallScreen && (
                            <Grid container item>
                                <TableContainer className="choose-son-view-card-table">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">
                                                    <p className="choose-son-view-card-table-title">Address</p>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <p className="choose-son-view-card-table-title">Profit</p>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {account.partners.map(son => (
                                                <SonTableData key={son.address} son={son} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )}
                    </div>
                </Zoom>

                {isSmallScreen && (
                    <div className="choose-son-view-card-container">
                        <Grid container item spacing={2}>
                            {account.partners.map(son => (
                                <Grid item xs={12} key={son.address}>
                                    <SonDataCard key={son.address} son={son} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}
            </div>
        );
    }

    function connectWallet() {
        return (
            <div className="referral-card-area">
                <div className="referral-card-wallet-notification">
                    <div className="referral-card-wallet-connect-btn" onClick={connect}>
                        <p>Connect Wallet</p>
                    </div>
                    <p className="referral-card-wallet-desc-text">Connect your wallet to referral LWH tokens!</p>
                </div>
            </div>
        );
    }
    function connected() {
        return (
            <div>
                {account.registered && (
                    <div>
                        <div className="referral-card-action-area">
                            <div className="referral-card-action-row">
                                <div className="referral-card-header">
                                    <p className="referral-card-header-title">My Invite Code:</p>
                                    <p className="referral-card-header-title">{address}</p>
                                </div>
                                <div className="referral-card-tab-panel">
                                    <div
                                        className="referral-card-tab-panel-btn"
                                        onClick={() => {
                                            copy(referral);
                                        }}
                                    >
                                        <p>{txnButtonText(pendingTransactions, "registering", "Copy")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Grid className="referral-card-grid" container direction="column" spacing={2}>
                            {account.referral != zero && (
                                <div>
                                    <div className="referral-card-action-area">
                                        <div className="referral-card-action-row">
                                            <div className="referral-card-header">
                                                <p className="referral-card-header-title">My Referral:</p>
                                                <p className="referral-card-header-title">{referral}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </div>
                )}
                {!account.registered && unregistered()}
            </div>
        );
    }

    function unreferred() {
        return (
            <div>
                <OutlinedInput
                    type="text"
                    placeholder="Address"
                    className="referral-card-action-input"
                    value={referral}
                    onChange={e => setReferral(e.target.value)}
                    labelWidth={0}
                />
                <div className="referral-card-tab-panel">
                    <div
                        className="referral-card-tab-panel-btn"
                        onClick={() => {
                            if (isPendingTxn(pendingTransactions, "registering")) return;
                            onChangeReferral();
                        }}
                    >
                        <p>{txnButtonText(pendingTransactions, "registering", "Referral")}</p>
                    </div>
                </div>
            </div>
        );
    }
    function unregistered() {
        return (
            <div className="referral-card-action-area">
                <div className="referral-card-action-row">
                    {!account.registered && (
                        <div className="referral-card-action-area">
                            <div className="referral-card-action-row">
                                <OutlinedInput
                                    type="text"
                                    placeholder="Address"
                                    className="referral-card-action-input"
                                    value={referral}
                                    onChange={e => setReferral(e.target.value)}
                                    labelWidth={0}
                                />
                                <div className="referral-card-tab-panel">
                                    <div
                                        className="referral-card-tab-panel-btn"
                                        onClick={() => {
                                            if (isPendingTxn(pendingTransactions, "registering")) return;
                                            onChangeReferral();
                                        }}
                                    >
                                        <p>{txnButtonText(pendingTransactions, "registering", "Register")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="referral-view">
                <Zoom in={true}>
                    <div className="referral-card">
                        <div className="referral-card-area">{!address ? connectWallet() : connected()}</div>
                    </div>
                </Zoom>
            </div>
            <br />
            <div>
                {account.partners.length > 0 && (
                    <div className="referral-view">
                        <div className="referral-card">
                            <div className="referral-card-header">
                                <p className="referral-card-header-title">My Partners:</p>
                            </div>
                            <Grid container item>
                                <TableContainer className="choose-bond-view-card-table">
                                    <div className="referral-card-area"> {partners()}</div>
                                </TableContainer>
                            </Grid>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Referral;
