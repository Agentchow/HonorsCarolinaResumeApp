import { AppBar, Toolbar, Typography, Modal, Box, TextField, List, Button, IconButton, Container, Grid } from "@mui/material";
import { Document } from "react-pdf";
import { Home } from "@mui/icons-material";
import React from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

export default function Main() {

    const [auth, setAuth] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);

    const [resumeView, setResumeView] =  React.useState(false);
    
    let url = null;
    let showResume = (uri) => {setResumeView(true); url = uri};
    let closeResume = () => {setResumeView(false); url = null};

    const loginOpen = () =>  setOpenModal(true);
    const loginClose = () => setOpenModal(false);

    const logIn = () => {setAuth(true)};
    const logOut = () => {
        setAuth(false);
    };

    const [approved, setApproved] = React.useState(null);
    const [pending, setPending] = React.useState(null);

    const getData = () => {
        axios.get("https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes").then(res => {
            console.log(res.data);
            let rowsApproved = [];
            let rowsPending = [];
            res.data.forEach(element => {
                if(element.approved === "approved") {
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
            setPending(rowsPending);
        })
    }
    
    const modalSubmit = () => { 
        getData();
        loginClose(); 
        logIn();
    }

    
    const [modalPost, setModalPost] = React.useState(false);

    const openPost = () =>  setModalPost(true);
    const closePost = () => setModalPost(false);

    const [name, setName] = React.useState(null);
    const [link, setLink] = React.useState(null);
    const [major, setMajor] = React.useState(null);
    const [tags, setTags] = React.useState(null);
    const [status, setStatus] = React.useState(null);

    const [currentId, setCurrentId] = React.useState(null);

    const deleteResume = () => {
        axios.delete("https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes/" + currentId).then(res => {
            setCurrentId(null);
            getData();
        })
    }

    const updateResume = () => {
        axios.put("https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes/" + currentId, {
            "approved": "approved"
        }).then(res => {
            setCurrentId(null);
            getData()
        })
    }


    const postSubmit = () => {
       console.log(name + link+  major + tags+ status);
       axios.post("https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes",{
            "name" : name,
            "link" : link,
            "major" : major,
            "tags" : tags,
            "approved": status
        }).then(res => {
            console.log(res.data);
            closePost();
            getData();
        })
    }

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
                        href={col.value}>View</Button>
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

    const columnsApproved = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'major', headerName: 'Major', width: 200 },
        { field: 'resume', headerName: 'Resume', width: 195,
            renderCell: (col) => (
                <strong>
                    <Button
                        onClick={showResume}
                        variant="contained"
                        size="small"
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

    return (
        <div>
            <header>
                <AppBar>
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}><Home/></IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow : 1}}>
                            Honors Carolina Resume App
                        </Typography>
                        <Button onClick={!auth? loginOpen : logOut} color= "inherit">{auth? "Logout" : "Login"}</Button>
                    </Toolbar>
                </AppBar>
                <Modal open={openModal} onClose={loginClose}>
                    <Box sx={style} component="form">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Login
                        </Typography>
                        <TextField id="user" label="Username" variant="outlined" />
                        <TextField id="pass" label="Password" variant="outlined" type="password"/>
                        <Button onClick={modalSubmit} color = "inherit">Login</Button>
                    </Box>
                </Modal>
                 <Modal open={modalPost} onClose={closePost}>
                    <Box sx={style} component="form">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            New Resume
                        </Typography>
                       <TextField id="name" label="Name" variant="outlined" onInput={ e=> setName(e.target.value)}/>
                        <TextField id="link" label="Resume Link" variant="outlined" onInput={ e=> setLink(e.target.value)}/>
                        <TextField id="tag" label="Tags" variant="outlined" onInput={ e=> setTags(e.target.value)}/>
                        <TextField id="status" label="Approved/Pending" variant="outlined" onInput={ e=> setStatus(e.target.value)}/>
                        <TextField id="major" label="Major" variant="outlined" onInput={ e=> setMajor(e.target.value)}/>
 
                        <Button onClick={postSubmit} color = "inherit">Post Resume</Button>
                    </Box>
                </Modal> 
            </header>
            {!auth && <Box m={6} pl={4} pr={4}>
                <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                    Welcome to the Honors Carolina Resume App! 
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    This is a bare bones skeleton of the app. At the moment the authentication via Shiolbeth sso is not setup
                    so put in any value for login/password

                    Our backend endpoint is hosted on an ExpressJS API on Openshift @
                    https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes
                </Typography>
                <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                    API
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                   Exposed Endpoints
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    GET: https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    GET: https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes/mongoResumeID
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    POST: https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes/
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    DELTE: https://node-mongodb-sample-git-rnarveka.apps.cloudapps.unc.edu/resumes/mongoResumeID
                </Typography>
                <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                    Application Architecture
                </Typography>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                    This app runs primarily on UNC CloudApps based on the OpenShift 4 Platform. The Backend ExpressJS
                    app exposes RestFull endpoints and enables data transfer to MongoDB. The Front End is a React App based
                    on MaterialUI and will soon be hosted on OpenShift after ITS bumps up our memmory requirments for Openshift
                    Pods.
                </Typography>
            </Box>}
            {auth && <Box m={6} pl={4} pr={4}>
                <Modal open={resumeView} onClose={closeResume}>
                    <Box sx={style} component="form">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Login
                        </Typography>
                        <Document file="https://drive.google.com/file/d/1hezwS7qfRwCvbGV8wNhLqvqXQxQp7-dH/view?usp=sharing"></Document>
                    </Box>
                </Modal>
                <Box mt={2} mb={2} pt={4}>
                    <Button  onClick={openPost} color = "inherit">Add Resume</Button>
                </Box>
                <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="h6" component="h5">
                    Approved Resumes
                </Typography>
                {approved != null && 
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={approved}
                        columns={columnsApproved}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        onSelectionModelChange={(id) => { setCurrentId(id[id.length - 1])}}
                        pb={2}
                    />
                </div>}
                <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                    Pending Resumes 
                </Typography>

                {pending != null && 
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={pending}
                        columns={columnsPending}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        onSelectionModelChange={(id) => { setCurrentId(id[id.length - 1])}}
                        pb={2}
                    />
                </div>}
                
            </Box>}
            <footer>
                <Box bgcolor="#2196f3" color="white"  pl={4} pr={4}>
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
