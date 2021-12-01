import React from "react";
import PropTypes from 'prop-types';
import Unauthenticated from "./Unauthenticated";
import Viewer from "./Viewer";
import { AppBar, Toolbar, Typography, Modal, Box, TextField, Button, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { Home } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { getAll, post, update, del, get } from "../services/ResumeService";

// Data Grid Toolbar styles
function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(0.5, 0.5, 0),
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        },
        textField: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
            margin: theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(0.5),
            },
            '& .MuiInput-underline:before': {
                borderBottom: `1px solid ${theme.palette.divider}`,
            },
        },
    }),
    { defaultTheme },
);

// Search Toolbar Code
QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};
function QuickSearchToolbar(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="h6" component="h5">
                Search
            </Typography>
            <TextField variant="standard" value={props.value} onChange={props.onChange} placeholder="Search…" className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />, endAdornment: (
                        <IconButton title="Clear" aria-label="Clear" size="small" style={{ visibility: props.value ? 'visible' : 'hidden' }} onClick={props.clearSearch}>
                            <ClearIcon fontSize="small" />
                        </IconButton>),
                }}
            />
        </div>
    );
}

export default function Main() {

    //State handlers for checkbox's
    const [checkBox, setCheckBox] = React.useState({
        privacy: false
    })
    const handleChange = (event) => {
        setCheckBox({
            ...checkBox,
            [event.target.name]: event.target.checked,
        });
    };
    const { privacy } = checkBox;

    // auth values, auth will be true for admin, studentAuth will be true for studentAuth
    const [auth, setAuth] = React.useState(false);
    const [studentAuth, setStudentAuth] = React.useState(false);
    const logIn = () => { setAuth(true) };
    const studentLogIn = () => { setStudentAuth(true); setStatus("pending"); }
    const logOut = () => {
        setAuth(false);
        setStudentAuth(false);
    };

    //Modal handlers
    const loginOpen = () => setOpenModal(true);
    const loginClose = () => setOpenModal(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [modalPost, setModalPost] = React.useState(false);
    const openPost = () => setModalPost(true);
    const closePost = () =>  { setModalPost(false); setPostError(null);  setName(null); setStatus("pending");
        setLink(null); setMajor(null); setTags(null);};
    const viewerOpen = () => setResumeViewer(true);
    const viewerClose = () => setResumeViewer(false);
    const [resumeViewer, setResumeViewer] = React.useState(false);

    //Form value handlers
    const [name, setName] = React.useState(null);
    const [link, setLink] = React.useState(null);
    const [major, setMajor] = React.useState(null);
    const [tags, setTags] = React.useState(null);
    const [status, setStatus] = React.useState("pending");
    const [postError, setPostError] = React.useState(null);

    //Form Submit Actions
    const adminSubmit = () => {
        getData();
        loginClose();
        logIn();
    }
    const studentSubmit = () => {
        getData();
        loginClose();
        studentLogIn();
    }

    //Search function for data grid
    const [searchText, setSearchText] = React.useState('');
    const requestSearch = (searchValue, type) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        if (type === "student") {
            const filteredRows = approved.filter((row) => {
                return Object.keys(row).some((field) => {
                    return searchRegex.test(row[field].toString());
                });
            });
            setStudentApprovedRows(filteredRows);
        } else if (type === "approved") {
            const filteredRows = approved.filter((row) => {
                return Object.keys(row).some((field) => {
                    return searchRegex.test(row[field].toString());
                });
            });
            setApprovedFiltered(filteredRows);
        } else {
            const filteredRows = pending.filter((row) => {
                return Object.keys(row).some((field) => {
                    return searchRegex.test(row[field].toString());
                });
            });
            setPendingFiltered(filteredRows);
        }
    };

    //set data grid rows for each table
    const [approved, setApproved] = React.useState(null);
    const [pending, setPending] = React.useState(null);
    const [studentApprovedRows, setStudentApprovedRows] = React.useState();
    const [approvedFiltered, setApprovedFiltered] = React.useState(approved);
    const [pendingFiltered, setPendingFiltered] = React.useState(pending);

    //set last checked row
    const [currentId, setCurrentId] = React.useState(null);
    const [currentResume, setCurrentResume] = React.useState(null);

    //api functions
    const getData = () => {
        getAll().then(res => {
            let rowsApproved = [];
            let rowsPending = [];
            res.data.forEach(element => {
                if (element.approved === "approved") {
                    rowsApproved.push({
                        id: element._id,
                        name: element.name,
                        major: element.major,
                        resume: element.link,
                        tags: element.tags
                    })
                } else {
                    rowsPending.push({
                        id: element._id,
                        name: element.name,
                        major: element.major,
                        resume: element.link
                    })
                }
            });
            setApproved(rowsApproved);
            setStudentApprovedRows(rowsApproved);
            setApprovedFiltered(rowsApproved)
            setPending(rowsPending);
            setPendingFiltered(rowsPending)
        })
    }
    const deleteResume = () => {
        del(currentId).then(res => {
            setCurrentId(null);
            getData();
        })
    }
    const updateResume = () => {
        update(currentId).then(res => {
            setCurrentId(null);
            getData();
        })
    }

    const viewResume = () => {
        get(currentId).then(res => {
            setCurrentResume(res.data);
            viewerOpen();
        })
    }

    const postSubmit = () => {
        post(name, link, major, tags, status).then(res => {
            closePost();
            getData();
        }).catch(e => {
            setPostError("Please ensure that name, link, major, comma or space separated tags, and appropriate status is set for resumes!");
        })
    }

    //Data Grid Styling
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& > :not(style)': { m: 1, width: '25ch' }
    };

    //Column setup for Pending DataGrid
    const columnsPending = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'major', headerName: 'Major', width: 200 },
        {
            field: 'resume', headerName: 'Resume', width: 275,
            renderCell: (col) => (
                <strong>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={viewResume}
                        target="_blank">View</Button>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={updateResume}>Accept</Button>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={deleteResume}>Reject</Button>
                </strong>
            )
        },
    ];

    //Column setup for Approved DataGrid
    const columnsApproved = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'major', headerName: 'Major', width: 200 },
        {
            field: 'resume', headerName: 'Resume', width: 195,
            renderCell: (col) => (
                <strong>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={viewResume}
                        target="_blank"
                        style={{ marginLeft: 16 }}>View</Button>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={deleteResume}>Delete</Button>
                </strong>
            )
        },
        { field: 'tags', headerName: 'Tags', width: 400 }
    ];

    //Column setup for Student DataGrid
    const studentApproved = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'major', headerName: 'Major', width: 200 },
        {
            field: 'resume', headerName: 'Resume', width: 195,
            renderCell: (col) => (
                <strong>
                    <Button
                        onClick={viewResume}
                        target="_blank"
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16 }}>View</Button>
                </strong>
            )
        },
        { field: 'tags', headerName: 'Tags', width: 400 }
    ];

    return (
        <div>
            <header>
                <AppBar>
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}><Home /></IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Honors Carolina Resume App
                        </Typography>
                        <Button onClick={(auth || studentAuth) ? logOut : loginOpen} color="inherit" title="loginButton">{(auth || studentAuth) ? "Logout" : "Login"}</Button>
                    </Toolbar>
                </AppBar>
                <Modal open={openModal} onClose={loginClose}>
                    <Box sx={style} component="form">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Login
                        </Typography>
                        <TextField id="user" label="Username" variant="outlined" />
                        <TextField id="pass" label="Password" variant="outlined" type="password" />
                        <Button onClick={adminSubmit} color="inherit">Admin</Button>
                        <Button onClick={studentSubmit} color="inherit">Student</Button>
                    </Box>
                </Modal>
                <Modal open={modalPost} onClose={closePost}>
                    <Box sx={style} component="form">
                        <Typography id="modal-modal-title" variant="h6" component="h2"> New Resume </Typography>
                        <TextField id="name" label="Name" variant="outlined" onInput={e => setName(e.target.value)} />
                        <TextField id="link" label="Resume Link" variant="outlined" onInput={e => setLink(e.target.value)} />
                        <TextField id="tag" label="Tags" variant="outlined" onInput={e => setTags(e.target.value)} />
                        {auth && <TextField id="status" label="Approved/Pending" variant="outlined" onInput={e => setStatus(e.target.value)} />}
                        <TextField id="major" label="Major" variant="outlined" onInput={e => setMajor(e.target.value)} />
                        {studentAuth && <FormControlLabel control={<Checkbox checked={privacy} onChange={handleChange} name="privacy" />} label="By checking this box you agree to all privacy policies." />}
                        {postError && <Typography color="common.red">{postError}</Typography>}
                        {auth && <Button onClick={postSubmit} color="inherit">Post Resume</Button>}
                        {studentAuth && <Button disabled={!privacy} onClick={postSubmit} color="inherit">Post Resume</Button>}
                    </Box>
                </Modal>
            </header>
            <Modal open={resumeViewer} onClose={viewerClose}>
                <Viewer resume={currentResume}></Viewer>
            </Modal>
            {!auth && !studentAuth && <Unauthenticated></Unauthenticated>}

            {/* STUDENT USER VIEW */}
            {/* This view will allow students to search resumes, and upload their own */}
            {/* Students will have Read and Updates access to all resume tables */}
            {studentAuth && <Box m={6} pl={4} pr={4}>
                <Box mt={2} mb={2} pt={4}>
                    <Button onClick={openPost} color="inherit">Add Resume</Button>
                </Box>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="h6" component="h5">
                    Student Resumes
                </Typography>
                {approved != null &&
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid components={{ Toolbar: QuickSearchToolbar }} rows={studentApprovedRows == null ? approved : studentApprovedRows}
                            columns={studentApproved} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection
                            onSelectionModelChange={(id) => { setCurrentId(id[id.length - 1]) }} pb={2}
                            componentsProps={{
                                toolbar: {
                                    value: searchText,
                                    onChange: (event) => requestSearch(event.target.value, "student"),
                                    clearSearch: () => requestSearch('', "student"),
                                },
                            }} />
                    </div>}
            </Box>}

            {/* ADMIN USER VIEW */}
            {/* This view will show all approved and pending resumes */}
            {/* ADMINs will have CRUD access to all resume tables */}
            {auth && <Box m={6} pl={4} pr={4}>
                <Box mt={2} mb={2} pt={4}>
                    <Button onClick={openPost} color="inherit">Add Resume</Button>
                </Box>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="h6" component="h5">
                    Approved Resumes
                </Typography>
                {approved != null &&
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            components={{ Toolbar: QuickSearchToolbar }} rows={approvedFiltered == null ? approved : approvedFiltered}
                            columns={columnsApproved} pageSize={5} owsPerPageOptions={[5]} checkboxSelection
                            onSelectionModelChange={(id) => { setCurrentId(id[id.length - 1]) }} pb={2}
                            componentsProps={{
                                toolbar: {
                                    value: searchText,
                                    onChange: (event) => requestSearch(event.target.value, "approved"),
                                    clearSearch: () => requestSearch('', "approved"),
                                },
                            }} />
                    </div>}
                <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                    Pending Resumes
                </Typography>
                {pending != null &&
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            components={{ Toolbar: QuickSearchToolbar }} rows={pendingFiltered == null ? pending : pendingFiltered}
                            columns={columnsPending} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection
                            onSelectionModelChange={(id) => { setCurrentId(id[id.length - 1]) }} pb={2}
                            componentsProps={{
                                toolbar: {
                                    value: searchText,
                                    onChange: (event) => requestSearch(event.target.value, "pending"),
                                    clearSearch: () => requestSearch('', "pending"),
                                },
                            }} />
                    </div>}

            </Box>}
            <footer>
                <Box bgcolor="#2196f3" color="white" pl={4} pr={4}>
                    <Box ml={2} mr={2} borderBottom={1} p={1}>
                        <Typography mt={2} id="modal-modal-title" variant="h6" component="h5">
                            About
                        </Typography>
                    </Box>
                    <Box ml={2} mr={2} pl={1} pr={1}>COMP 523 Project</Box>
                    <Box ml={2} mr={2} pl={1} pr={1} pb={3}>Client: Honors Carolina</Box>
                </Box>
            </footer>
        </div>
    )
}


