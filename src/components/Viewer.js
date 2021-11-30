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
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& > :not(style)': { m: 1, width: '50ch' }
    };

    let comments = [];

    if(resume.comments.length !== 0) {
        resume.comments.forEach(comment => {
            comments.push(
                <Typography id="modal-modal-title" variant="h6" component="h2">
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
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h2" component="h2">
                {resume.name}
            </Typography>
            <iframe title="resume" src={resume.link} height="250" width="100%"></iframe>
            <Typography id="modal-modal-title" variant="h4" component="h4">
                <strong>Comments</strong>
            </Typography>
            <div id ="comment-holder" >
                {comments}
            </div>
            <Typography id="modal-modal-title" variant="h4" component="h4">
                <strong >New Comment</strong>
            </Typography>
            <TextField id="commenter" label="Name" variant="outlined" onInput={e => setCommenter(e.target.value)} />
            <TextField id="message" label="comment" variant="outlined" onInput={e => setMessage(e.target.value)} />
            <Button onClick={postSubmit} color="inherit">Post</Button>
        </Box>
    )
}