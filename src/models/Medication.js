import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Taken', 'Missed'],
        default: 'Pending',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);
