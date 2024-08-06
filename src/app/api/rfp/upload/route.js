import { NextResponse } from 'next/server';
import connectDB from '../../../../config/database';
import { MongoClient, GridFSBucket } from 'mongodb';
import Rfp from '../../../../models/Rfp';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

// Configure multer to store files in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

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
        const client = await connectDB();
        const db = client.db();
        const bucket = new GridFSBucket(db);

        await uploadMiddleware(req, {});

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


        // Create promises for each file upload
        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const readableStream = new Readable();
                readableStream._read = () => {};
                readableStream.push(file.buffer);
                readableStream.push(null);

                // Store each file in GridFS
                const uploadStream = bucket.openUploadStream(file.name, {
                    metadata: { title, description },
                });

                readableStream.pipe(uploadStream)
                    .on('error', (err) => {
                        console.error('GridFS Upload Error:', err);
                        reject('Server error during upload');
                    })
                    .on('finish', () => {
                        console.log('File uploaded successfully to GridFS');
                        resolve('RFP uploaded successfully');
                    });
            });
        });

        // Await all uploads to complete
        await Promise.all(uploadPromises);

        return NextResponse.json({ message: 'All RFPs uploaded successfully' }, { status: 201 });
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