import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
    title: 'DukaHub - Shop Online in Kenya',
    description: 'Kenya\'s premier online shopping destination. Electronics, Fashion, Phones, Home & Kitchen and more. Free delivery, M-Pesa payments.',
    icons: {
        icon: '/logo.png',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
