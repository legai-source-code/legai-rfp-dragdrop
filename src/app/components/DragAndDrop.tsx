'use client'
import { MouseEvent, useState } from "react"
import Dropzone from "react-dropzone"
import axios from "axios";

export default function DragAndDrop() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    const handleDrop = (acceptedFiles: any[]) => {
        if (acceptedFiles.length === 0) {
            console.log("No RFP files selected");
            return
        }

        // Process the selected PDF files
        console.log("Selected RFP example files", acceptedFiles);

        // Set the uploaded files
        setUploadedFiles(acceptedFiles);
    }

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (uploadedFiles.length === 0) {
            alert('Please upload at least one RFP file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        console.log('title', title);
        console.log('description', description);

        uploadedFiles.forEach((file) => formData.append('file', file));

        try {
            const response = await axios.post('/api/rfp/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('RFP submitted successfully');
                setUploadedFiles([]); // Clear uploaded files after successful submission
                setTitle(''); // Reset title
                setDescription(''); // Reset description
            }
        } catch (error) {
            console.error('Error uploading RFP:', error);
            alert('Failed to submit RFP');
        }
    }

    return (
        <>
            <div className="rfp-form">
                <input
                    type="text"
                    placeholder="RFP Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="title-input"
                    required
                />
                <textarea
                    placeholder="RFP Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
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
            <button type="button" onClick={(e) => handleSubmit(e)}>
                Submit RFP
            </button>
        </>
    )
}