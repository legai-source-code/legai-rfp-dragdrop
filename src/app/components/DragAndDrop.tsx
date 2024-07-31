'use client'
import { useState } from "react"
import Dropzone from "react-dropzone"

export default function DragAndDrop() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


    const handleDrop = (acceptedFiles: any[]) => {
        if (acceptedFiles.length === 0) {
            console.log("no rfp files");
            return
        }

        // Process the selected PDF files
        console.log("Selected RFP example files", acceptedFiles);

        // Call function to handle the RFP files
        // TODO: pass to back end program for processing 
        setUploadedFiles(acceptedFiles);
    }

    return (
        <>
            <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section className="dropZone">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag & drop some files here, or click to select files</p>
                        </div>
                    </section>
                )}
            </Dropzone>
            <h3 className="files-list-heading">Uploaded RFP files</h3>
            {/*  Display files that were dropped */}
            {uploadedFiles.length > 0 && (
                <div className="files-list-container">
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}