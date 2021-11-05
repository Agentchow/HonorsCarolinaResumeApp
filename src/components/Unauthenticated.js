import React from 'react';
import { Typography, Box } from "@mui/material";


export default function Unauthenticated() {
    return (
        <Box m={6} pl={4} pr={4}>
            <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                Welcome to the Honors Carolina Resume App!
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                This is a bare bones skeleton of the app. At the moment the authentication via Shiolbeth sso is not setup
                so put in any value for login/password

                Our backend endpoint is hosted on an ExpressJS API on Openshift @
                https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes
            </Typography>
            <Typography mt={2} mb={2} pb={3} pt={3} id="modal-modal-title" variant="h6" component="h5">
                API
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                Exposed Endpoints
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                GET: https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                GET: https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes/mongoResumeID
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                POST: https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes/
            </Typography>
            <Typography mt={2} mb={2} pb={3} id="modal-modal-title" variant="p" component="p">
                DELETE: https://honor-carolina-resume-backend-rnarveka.apps.cloudapps.unc.edu/resumes/mongoResumeID
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
        </Box>
    )
}