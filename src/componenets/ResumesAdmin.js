import React from "react";
import ApprovedResumes from "./ApprovedResume";
import { Box, Typography } from "@mui/material";
import axios from "axios";

export default function ResumesAdmin({resumes}) {

    const [approved, setApproved] = React.useState(null);
    const [pending, setPending] = React.useState(null);

    const getData = () => {
        axios.get('http://localhost:3000/resumes').then(res => {

            let approved
            let pending = []
            res.data.forEach(element => {
                (element.approved === 'approved') ? approved.push(<ApprovedResumes resume = {element} ></ApprovedResumes>) : pending.push(<ApprovedResumes resume={element}></ApprovedResumes>)
            });
            console.log([approved, pending])
            setApproved(approved);
            setPending(pending);
        })
    }


    return (
        <Box>
            <Box>
                <Typography id="modal-modal-title" variant="h6" component="h5">
                    Approved Resumes
                </Typography>
                <div>
                </div>
            </Box>
        </Box>
    )
}
