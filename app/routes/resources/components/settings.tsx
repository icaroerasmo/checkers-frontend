import { Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { MinimaxDifficultyLevel, PieceType } from "../models/types"
import { useState } from "react";
import { setSettings } from "../services/tableService";
import { movesCoreTransformer } from "../util/helpers";

export default function Settings({state}: {state:any}) {

    const [data, setData] = state;

    let settingObj: any = {
        playerTurn: "",
        difficultyLevel: ""
    }

    const [settings, setSetting] = useState(settingObj);

    const nameExtractor = (name: string) => {

        if(!name || name.length < 1) {
            return name;
        }

        let head = name[0].toUpperCase();
        let tail = name.substring(1, name.length).toLowerCase();

        return (head+tail).replace(/[^a-zA-Z0-9]/g, " ");
    }

    const difficultyOptions = Object.values(MinimaxDifficultyLevel)
    const playerOptions = Object.values(PieceType)

    const saveDiffLevel = (event: SelectChangeEvent) => {
        setSetting({...settings, difficultyLevel: event.target.value});
    };

    const savePlayerTurn = (event: SelectChangeEvent) => {
        setSetting({...settings, playerTurn: event.target.value});
    };

    const sendSetting = () => {
        setSettings(Object.assign(settings, {sessionId: state.sessionId})).then((response) => {
            response.movesCore = movesCoreTransformer(response.movesCore)
            setData({tableResponse: response, possibleMoves: []})
        })
    }

    return (
        <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center">
            <Grid item lg={6} xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="difficultyLevel">Difficulty Level</InputLabel>
                    <Select id="difficultyLevel" labelId="difficultyLevel"
                        label="Difficulty Level" value={settings.difficultyLevel}
                        onChange={saveDiffLevel}>
                        {difficultyOptions.map((op, index) => (
                            <MenuItem value={op}> {nameExtractor(op)} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="playerTurn">Player Turn</InputLabel>
                    <Select id="playerTurn" labelId="playerTurn"
                        label="Player Turn" value={settings.playerTurn}
                        onChange={savePlayerTurn}>
                        {playerOptions.map((op, index) => (
                            <MenuItem value={op}> {nameExtractor(op)} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <Button onClick={() => sendSetting()} variant="contained" color="success">
                        New Game
                    </Button>
                </FormControl>
            </Grid>
        </Grid>
    )
}