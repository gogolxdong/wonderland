import { priceUnits, trim } from "../../helpers";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./referral.scss";
import { Skeleton } from "@material-ui/lab";
import { IAccountSlice, ISonSlice } from "src/store/slices/account-slice";
import { isWhiteSpaceLike } from "typescript";

interface ISonProps {
    son: ISonSlice;
}

export function SonDataCard({ son }: ISonProps) {
    const isBondLoading = !son.profit ?? true;

    return (
        <Slide direction="up" in={true}>
            <Paper className="son-data-card">
                <div className="data-row">
                    <p className="son-name-title">Address</p>
                    <p className="son-price son-name-title">
                        <>{son.address}</>
                    </p>
                </div>

                <div className="data-row">
                    <p className="son-name-title">Profit</p>
                    <p className="son-name-title">{isBondLoading ? <Skeleton width="80px" /> : son.profit.toNumber() / 10 ** 9}</p>
                </div>
            </Paper>
        </Slide>
    );
}

export function SonTableData({ son }: ISonProps) {
    const isBondLoading = !son.address ?? true;

    return (
        <TableRow>
            <TableCell align="left">
                <div className="son-name">
                    <p className="son-name-title">{son.address}</p>
                </div>
            </TableCell>
            <TableCell align="center">
                <div className="son-name">
                    <p className="son-name-title">{isBondLoading ? <Skeleton width="50px" /> : `$${son.profit.toNumber() / 10 ** 9}`}</p>
                </div>
            </TableCell>
        </TableRow>
    );
}
