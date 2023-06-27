import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
    Card,
    Stack,
    Button,
    Popover,
    MenuItem,
    Container,
    Typography,
    IconButton,
    styled,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Autocomplete,
    Box,
    Checkbox,
    InputAdornment,
} from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
// components
import { Icon } from '@iconify/react';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';


const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}`]: {
        // backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
        borderColor: 'green'
    },
    '& input:invalid + fieldset': {
        borderColor: 'red'
    },
});

const headSname = `${localStorage.getItem('sname')} Center`;

function PMSUserMgr() {

    const [open, setOpen] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [psnDelDialogOpen, setPsnDelDialogOpen] = useState(false);

    const [personnelId, setPersonnelId] = useState('');
    const [personnelSecret, setPersonnelSecret] = useState('');
    const [personnelInputSecret, setPersonnelInputSecret] = useState(null);
    const [personnelInputSecretConfirm, setPersonnelInputSecretConfirm] = useState(null);
    const [personnelFirstname, setPersonnelFirstname] = useState('');
    const [personnelLastname, setPersonnelLastname] = useState('');
    const [personnelIsactive, setPersonnelIsactive] = useState('');

    const [positionName, setPositionName] = useState('');
    const [positionId, setPositionId] = useState('');
    const [positions, setPositions] = useState([]);

    const [levels, setLevels] = useState([]);
    const [levelViews, setLevelViews] = useState([]);

    const [DMISLevelName, setDMISLevelName] = useState('');
    const [DMISLevelId, setDMISLevelId] = useState('');
    const [DMISLevelDescription, setDMISLevelDescription] = useState('');
    const [DMISLevelViewName, setDMISLevelViewName] = useState('');
    const [DMISLevelViewId, setDMISLevelViewId] = useState('');
    const [DMISLevelViewDescription, setDMISLevelViewDescription] = useState('');
    const [isDMIS, setIsDMIS] = useState(false);

    const [PMSLevelName, setPMSLevelName] = useState('');
    const [PMSLevelId, setPMSLevelId] = useState('');
    const [PMSLevelDescription, setPMSLevelDescription] = useState('');
    const [isPMS, setIsPMS] = useState(false);

    const [DSMSLevelName, setDSMSLevelName] = useState('');
    const [DSMSLevelId, setDSMSLevelId] = useState('');
    const [DSMSLevelDescription, setDSMSLevelDescription] = useState('');
    const [isDSMS, setIsDSMS] = useState(false);

    const [PSNLvViews, setPSNLvViews] = useState([]);

    const [CBSLevelName, setCBSLevelName] = useState('');
    const [CBSLevelId, setCBSLevelId] = useState('');
    const [CBSLevelDescription, setCBSLevelDescription] = useState('');
    const [CBSLvViewId, setCBSLvViewId] = useState('');
    const [CBSLvViewName, setCBSLvViewName] = useState('');
    const [CBSLvViewDescr, setCBSLvViewDescr] = useState('');

    const [isCBS, setIsCBS] = useState(false);

    const [pageSize, setPageSize] = useState(25);

    const navigate = useNavigate();
    const isSkip = (value) => value !== '';
    const [showSecret, setShowSecret] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    return (
        <>

        </>
    )
}

export default PMSUserMgr