import { NextResponse } from 'next/server';
import connectDB from '../../../../config/database';
import Rfp from '../../../../models/Rfp';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), '/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage and handling form fields
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
});

// Middleware to handle file uploads and parse fields
const uploadMiddleware = (req, res) =>
    new Promise((resolve, reject) => {
        upload.array('files')(req, res, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

export const POST = async (req) => {
    try {
        await connectDB();
        await uploadMiddleware(req, {});

        // After multer processes the request, req.body and req.files should be available

        const formData = await req.formData();

        const title = formData.get('title');
        const description = formData.get('description');
        let files = formData.get('file');

        console.log('title', title);
        console.log('description', description);
        console.log('files', files);

        if (!title || !description || !files || files.length === 0) {
            return NextResponse.json({ error: 'Missing required fields or files' }, { status: 400 });
        }

         // Ensure files is always an array
         if (!Array.isArray(files)) {
            files = [files];
        }

         // Map the files to the format expected by the model
         const fileEntries = files.map(file => ({
            originalName: file.originalname,
            documentUrl: 'test123'
        }));

        // Create new RFP documents for each file
        const rfpPromises = files.map(file => {
            const newRfp = new Rfp({
                title,
                description,
                files: fileEntries, // Store the path of the uploaded document
                // createdBy: req.user._id, // Uncomment and use if authentication is implemented
            });

            return newRfp.save();
        });

        await Promise.all(rfpPromises);

        return NextResponse.json({ message: 'RFPs uploaded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error saving RFPs:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
};

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, we'll handle it with multer
    },
};