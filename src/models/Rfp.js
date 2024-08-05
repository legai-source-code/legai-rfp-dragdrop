import { Schema, model, models } from 'mongoose';

const RfpSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // TODO: Update this to be required once authentication is implemented
        required: false
    },
    files: [
        {
            originalName: { type: String, required: false },
            documentUrl: { type: String, required: true },
            uploadDate: { type: Date, default: Date.now }
        }
    ],
    submissionDate: {
        type: Date
    },
    tags: {
        type: [String],
        default: []
    },
    version: {
        type: Number,
        default: 1
    },
    history: [
        {
            version: Number,
            updatedAt: Date,
            changes: String
        }
    ]
}, {
    timestamps: true
});

const Rfp = models.Rfp || model('Rfp', RfpSchema);

export default Rfp;