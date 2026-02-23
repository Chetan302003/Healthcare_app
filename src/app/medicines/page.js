'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './medicines.module.css';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Plus, X, Calendar as CalendarIcon } from 'lucide-react';

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const router = useRouter();

    // Add Medicine Form State
    const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });

    const fetchMedicines = async () => {
        try {
            const res = await fetch('/api/medicines');
            if (res.ok) {
                const data = await res.json();
                setMedicines(data.medications);
            } else if (res.status === 401) {
                router.push('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, [router]);

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Taken' ? 'Pending' : 'Taken';
        try {
            const res = await fetch(`/api/medicines/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchMedicines();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMed)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewMed({ name: '', dosage: '', time: '' });
                fetchMedicines();
            } else {
                alert('Error adding medicine');
            }
        } catch (err) {
            alert('Error adding medicine');
        }
    };

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h2>Medicines Schedule</h2>
                <div className={css.monthSelector}>
                    <ChevronLeft size={20} />
                    <span>October 2023</span>
                    <ChevronRight size={20} />
                </div>
            </header>

            {/* Date Scroller (Static visuals) */}
            <div className={css.dateScroller}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                    <div key={i} className={`${css.dateCard} ${i === 2 ? css.activeDate : ''}`}>
                        <span className={css.dayName}>{day}</span>
                        <span className={css.dayNum}>{10 + i}</span>
                    </div>
                ))}
            </div>

            <div className={css.sectionHeader}>
                <h3>Your Medications</h3>
            </div>

            <div className={css.medList}>
                {loading ? (
                    <p>Loading...</p>
                ) : medicines.length === 0 ? (
                    <div className={css.emptyState}>No medicines built yet.</div>
                ) : (
                    medicines.map(med => (
                        <div key={med.id} className={css.medCard} onClick={() => handleUpdateStatus(med.id, med.status)}>
                            <div className={css.medInfo}>
                                <div className={css.medTime}>{med.time}</div>
                                <div>
                                    <h4>{med.name}</h4>
                                    <p>{med.dosage}</p>
                                </div>
                            </div>
                            <div className={css.statusWrap}>
                                {med.status === 'Taken' ?
                                    <CheckCircle2 color="var(--success)" size={28} /> :
                                    <span className={css.pendingDot}></span>
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className={css.floatingBtn} onClick={() => setShowAddModal(true)}>
                <Plus size={24} color="white" />
            </button>

            {/* Add Modal */}
            {showAddModal && (
                <div className={css.modalOverlay}>
                    <div className={css.modalContent}>
                        <div className={css.modalHeader}>
                            <h3>Add Medicine</h3>
                            <button className={css.closeBtn} onClick={() => setShowAddModal(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleAddMedicine} className={css.form}>
                            <div className="input-group">
                                <label className="input-label">Medicine Name</label>
                                <input required type="text" className="input-field" placeholder="e.g. Paracetamol"
                                    value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Dosage</label>
                                <input required type="text" className="input-field" placeholder="e.g. 1 Pill (500mg)"
                                    value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Time</label>
                                <input required type="time" className="input-field"
                                    value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} />
                            </div>

                            <button type="submit" className="btn btn-primary mt-4">Save Medicine</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
