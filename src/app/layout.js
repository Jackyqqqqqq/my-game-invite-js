import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: '游戏邀请系统',
    description: '一个简单的游戏邀请管理系统',
};

export default function RootLayout({ children }) {
    return (
        <html lang="zh">
        <body className={inter.className}>
        {/* 主应用容器 */}
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
        </body>
        </html>
    );
}