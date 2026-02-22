'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './onboarding.module.css';
import { Activity } from 'lucide-react';

const slides = [
    { title: 'Digital Health Wallet', desc: 'Manage your health, medicines, and medical records securely in one place.' },
    { title: 'Smart Reminders', desc: 'Never miss a dose with our intelligent medication tracking system.' },
    { title: 'Weekly Reports', desc: 'Visualize your health progress effortlessly.' },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className={css.container}>
            <div className={css.iconWrapper}>
                <Activity size={48} className={css.mainIcon} color="var(--primary)" />
            </div>

            <div className={css.content}>
                <h1 className={css.title}>{slides[step].title}</h1>
                <p className={css.desc}>{slides[step].desc}</p>

                <div className={css.dots}>
                    {slides.map((_, i) => (
                        <div key={i} className={`${css.dot} ${i === step ? css.activeDot : ''}`} />
                    ))}
                </div>
            </div>

            <div className={css.footer}>
                <button className="btn btn-primary" onClick={handleNext}>
                    {step === slides.length - 1 ? 'Get Started' : 'Next'}
                </button>
            </div>
        </div>
    );
}
