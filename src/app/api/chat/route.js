import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { message } = await req.json();
        const msgLower = message.toLowerCase();

        let reply = "I'm a demo assistant for the CareSync app. Try asking about your mental health or test results!";

        // Self-harm / Safety Rule
        if (msgLower.includes('kill') || msgLower.includes('die') || msgLower.includes('suicide') || msgLower.includes('harm myself')) {
            reply = "I'm an AI, but your life is precious and important. Please reach out to a professional immediately. In a crisis, you can call emergency services or a local crisis hotline like 988.";
        }
        // Stress / Anxiety rule (Module 5 target)
        else if (msgLower.includes('stress') || msgLower.includes('anxious') || msgLower.includes('panic') || msgLower.includes('overwhelmed') || msgLower.includes('sad')) {
            reply = "I'm sorry you're feeling this way. High stress can affect your physical health. Try a 4-7-8 breathing exercise: inhale for 4 seconds, hold for 7, exhale for 8. Would you like me to recommend a journaling exercise?";
        }
        // Medication Rule
        else if (msgLower.includes('medicine') || msgLower.includes('pill') || msgLower.includes('remind') || msgLower.includes('forgetting')) {
            reply = "Consistency is key for your health! I can see your adherence score on the dashboard. Did you know you can set up Guardian alerts if you miss more than 3 doses?";
        }
        // Lab Reports Rule
        else if (msgLower.includes('lab') || msgLower.includes('report') || msgLower.includes('blood') || msgLower.includes('sugar') || msgLower.includes('ldl')) {
            reply = "Based on our AI highlight feature, abnormal values in Lab Reports like high sugar or low hemoglobin are automatically flagged for your doctor so you can easily spot trends.";
        }

        return NextResponse.json({ reply }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ reply: 'Sorry, I encountered an error answering that.' }, { status: 500 });
    }
}
