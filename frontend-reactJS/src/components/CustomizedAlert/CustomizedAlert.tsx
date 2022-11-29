import { Alert, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

export enum Type {
  Error = "error",
  Success = "success" 
}

interface Props {
    messageType: Type;
    isActive: boolean;
    onClick: () => void;
    message: string;
    redirectRoute?: String
}

export const CustomizedAlert = (props: Props) => {
    let { messageType, isActive, message, onClick  } = props;

    return <>
        <Alert
        sx={{
          position: 'fixed',
          zIndex: 1100,
          right: isActive ? 0 : "-1000px",
          transition: 'all .3s ease-in-out'
        }}
        severity={messageType}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClick}
          >
            {messageType === Type.Error ? <CloseIcon fontSize="inherit" /> : <DoneIcon fontSize="inherit" />}
          </IconButton>
        }>
        {message}
      </Alert>

    </>
}