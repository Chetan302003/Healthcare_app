import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
    title: "HealthCare+ | Digital Health Wallet",
    description: "Manage your health, medicines, and medical records",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="app-container">
                    <ClientLayout>{children}</ClientLayout>
                </div>
            </body>
        </html>
    );
}
