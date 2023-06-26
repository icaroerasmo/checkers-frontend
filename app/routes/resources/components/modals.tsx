import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useSpring, animated } from '@react-spring/web';
import { Box, Grid, Typography } from '@mui/material';
import { faFileLines, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Settings from './settings';
import { MouseEventHandler } from 'react';
import { PLAYER_2_PIECE_COLOR, PLAYER_1_PIECE_COLOR } from '../constants/colors';

interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: 'absolute' as 'absolute',
  borderRadius: '15px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: "300px",
  maxWidth: "500px",
  width: "30%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function LogModal({open, handleOpen, handleClose, state}: {open: boolean, handleOpen: MouseEventHandler, handleClose: MouseEventHandler, state:any}) {
    
    const [data] = state
    
    let logs = '';

    if(data.tableResponse.movesLog) {
        logs = data.tableResponse.movesLog.map((x:string, index: number) => 
              <div key={index} style={{padding: "2px", 
                color: x.includes("Red") ? 
                  PLAYER_1_PIECE_COLOR : PLAYER_2_PIECE_COLOR}}>
                  {x}
              </div>)
    }
    
    return (
        <Grid item>
            <Button variant="contained" onClick={handleOpen} endIcon={<FontAwesomeIcon icon={faFileLines}/>}>
                Log
            </Button>
            <Modal
                aria-labelledby="log-modal-title"
                aria-describedby="log-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h6">Logs</Typography>
                        <Grid container sx={{backgroundColor: '#ccc', overflowY: 'scroll', height: '300px'}}>
                          <div>
                            {logs}
                          </div>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>
        </Grid>
    )
}

function SettingsModal({open, handleOpen, handleClose, state}: {open: boolean, handleOpen: MouseEventHandler, handleClose: MouseEventHandler, state:any}) {
    return (
        <Grid item>
            <Button variant="contained" onClick={handleOpen} endIcon={<FontAwesomeIcon icon={faGear}/>}>
                Settings
            </Button>
            <Modal
                aria-labelledby="settings-modal-title"
                aria-describedby="settings-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Settings callback={handleClose} state={state}/>
                    </Box>
                </Fade>
            </Modal>
        </Grid>
    )
}

export function Modals({state}: {state:any}) {
    
    const [settingsOpen, setSettingsOpen] = React.useState(true);
    const handleSettingsOpen = () => setSettingsOpen(true);
    const handleSettingsClose = () => setSettingsOpen(false);
  
    const [open, setLogOpen] = React.useState(false);
    const handleLogOpen = () => setLogOpen(true);
    const handleLogClose = () => setLogOpen(false);

    return (
      <Grid container spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
            <LogModal open={open} handleOpen={handleLogOpen} handleClose={handleLogClose} state={state}></LogModal>
            <SettingsModal open={settingsOpen} handleOpen={handleSettingsOpen} handleClose={handleSettingsClose} state={state}></SettingsModal>
      </Grid>
    );
  }