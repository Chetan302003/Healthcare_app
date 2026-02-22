'use client';

import css from './wallet.module.css';
import { FileText, Download, UploadCloud, FileImage } from 'lucide-react';

export default function Wallet() {
    const documents = [
        { id: 1, title: 'Complete Blood Count', date: 'Oct 12, 2023', type: 'pdf', doctor: 'Dr. Smith' },
        { id: 2, title: 'Chest X-Ray', date: 'Sep 28, 2023', type: 'image', doctor: 'Dr. Jones' },
        { id: 3, title: 'Prescription - Flu', date: 'Sep 15, 2023', type: 'pdf', doctor: 'Dr. Ali' },
    ];

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h2>Health Wallet</h2>
                <p>Your medical records in one place</p>
            </header>

            <div className={css.uploadZone}>
                <UploadCloud size={32} color="var(--primary)" />
                <p>Tap to upload a new document</p>
                <span>Supports PDF, JPG, PNG</span>
            </div>

            <div className={css.filterChips}>
                <button className={`${css.chip} ${css.activeChip}`}>All</button>
                <button className={css.chip}>Prescriptions</button>
                <button className={css.chip}>Lab Reports</button>
            </div>

            <div className={css.docList}>
                {documents.map(doc => (
                    <div key={doc.id} className={css.docCard}>
                        <div className={css.docIcon}>
                            {doc.type === 'pdf' ? <FileText size={24} color="#EF4444" /> : <FileImage size={24} color="#2563EB" />}
                        </div>
                        <div className={css.docInfo}>
                            <h4>{doc.title}</h4>
                            <p>{doc.date} • {doc.doctor}</p>
                        </div>
                        <button className={css.downloadBtn}>
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
