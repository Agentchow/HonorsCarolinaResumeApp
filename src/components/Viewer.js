import React from 'react';
import { Typography, Box, TextField, Button } from "@mui/material";
import { newComment } from "../services/ResumeService";

export default function Viewer({resume}) {

    const [commenter, setCommenter] = React.useState("");
    const [message, setMessage] = React.useState("");


    const postSubmit = () => {
        newComment(resume._id, commenter, message).then(res => {
            comments.push(
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <strong>{commenter}</strong>: {message}
                </Typography>
            )
        })
        
    }

    const style = {
        position: 'absolute',
        height: 500,
        width: 550,
        overflowY: 'scroll',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
    };

    let comments = [];

    if(resume.comments.length !== 0) {
        resume.comments.forEach(comment => {
            comments.push(
                <Typography id="modal-modal-title" variant="p" component="p">
                    <strong>{comment.name}</strong>: {comment.comment}
                </Typography>
            )
        })
    } else {
        comments.push(
            <Typography id="modal-modal-title" variant="h6" component="h2">
                <strong>There are no comments for this resume.</strong>
            </Typography>
        )
    }

    return (
        <Box sx={style} style={{margin: "auto"}}>
            <Typography id="modal-modal-title" variant="h2" component="h2" pl={2} pb={1} pt={2} pr={2}>
                {resume.name}
            </Typography>
            <Box pr={2} pl={2}>
            <iframe title="resume" src={resume.link} height="200" width="500" style={{padding: 2}}></iframe>
            </Box>
            <Typography id="modal-modal-title" variant="h4" component="h4" pl={2} pb={1} pt={2} pr={2}>
                Comments
            </Typography>
            <Box id ="comment-holder" pr={2} pl={2}>
                {comments}
            </Box>
            <Typography id="modal-modal-title" variant="h6" component="h6" pl={2} pb={1} pt={2} pr={2}security=''>
                New Comment
            </Typography>
            <Box pr={2} pl={2}>
                <TextField id="commenter" label="Name" variant="outlined" size="small" pr={2} onInput={e => setCommenter(e.target.value)}/>
                <TextField id="message" label="Comment" variant="outlined" size="small" onInput={e => setMessage(e.target.value)}/>
            </Box>
            <Box p={2}>
                <Button onClick={postSubmit} color="inherit" p={2}>Post</Button>
            </Box>
        </Box>
    )
}