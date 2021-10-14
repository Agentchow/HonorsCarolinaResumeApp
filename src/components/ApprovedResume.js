export default function ApprovedResumes({resume}) {
    return(
        <div>
            <h3>{resume.name}</h3>
            <p>{resume.date}</p>
            <p>{resume.resume}</p>
        </div>
    )
}