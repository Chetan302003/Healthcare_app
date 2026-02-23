'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import css from './wallet.module.css';
import { FileText, Download, UploadCloud, FileImage, X, Activity } from 'lucide-react';

export default function Wallet() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Lab Report');
    const [doctorName, setDoctorName] = useState('');
    const fileInputRef = useRef(null);

    const router = useRouter();

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/records');
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.records);
            } else if (res.status === 401) {
                router.push('/login');
            }
        } catch (err) {
            console.error('Error fetching records:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [router]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title || !category) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('doctor_name', doctorName);

        try {
            const res = await fetch('/api/records', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setShowModal(false);
                setFile(null);
                setTitle('');
                setCategory('Lab Report');
                setDoctorName('');
                fetchRecords(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.message || 'Error uploading record');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Error during upload');
        } finally {
            setUploading(false);
        }
    };

    const getIcon = (url) => {
        if (!url) return <FileText size={24} color="#6B7280" />;
        const ext = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return <FileImage size={24} color="#2563EB" />;
        }
        return <FileText size={24} color="#EF4444" />;
    };

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h2>Health Wallet</h2>
                <p>Your medical records in one place</p>
            </header>

            <div className={css.uploadZone} onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
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
                {loading ? (
                    <div className="flex justify-center py-4"><Activity className="animate-spin text-primary" /></div>
                ) : documents.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No records found. Upload one above.</div>
                ) : (
                    documents.map(doc => (
                        <div key={doc.id} className={css.docCard} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div className={css.docIcon}>
                                        {getIcon(doc.file_url)}
                                    </div>
                                    <div className={css.docInfo}>
                                        <h4>{doc.title}</h4>
                                        <p>{new Date(doc.date).toLocaleDateString()} {doc.doctor_name ? `• ${doc.doctor_name}` : ''}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '500' }}>{doc.category}</span>
                                    </div>
                                </div>
                                <button className={css.downloadBtn} onClick={() => window.open(doc.file_url, '_blank')}>
                                    <Download size={20} />
                                </button>
                            </div>

                            {/* AI Highlights Section (Module 2) */}
                            {doc.highlights && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Activity size={14} color="#EF4444" /> AI ANALYSIS HIGHLIGHTS
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        {Object.entries(doc.highlights).map(([key, val]) => (
                                            <div key={key} style={{ fontSize: '0.8rem' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                                                <span style={{ fontWeight: '500', color: val.includes('High') || val.includes('Low') || val.includes('Caution') ? '#EF4444' : '#10B981' }}>{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#6B7280" />
                        </button>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Upload Document</h3>

                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Document File *</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Title *</label>
                                <input
                                    className="input-field"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Complete Blood Count"
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Category *</label>
                                <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Discharge Summary">Discharge Summary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Doctor's Name (Optional)</label>
                                <input
                                    className="input-field"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    placeholder="Dr. Smith"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={uploading || !file}>
                                {uploading ? 'Uploading...' : 'Save Record'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
