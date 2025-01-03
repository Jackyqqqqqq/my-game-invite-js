import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const SessionWrapper = ({ children, onSessionExpired }) => {
    useEffect(() => {
        // 检查会话是否过期
        const checkSession = () => {
            const sessionUser = Cookies.get('currentUser');
            if (!sessionUser) {
                onSessionExpired();
            }
        };

        // 每分钟检查一次会话状态
        const interval = setInterval(checkSession, 60000);

        // 监听存储事件（用于多标签页同步）
        const handleStorageChange = (e) => {
            if (e.key === 'currentUser' && !e.newValue) {
                onSessionExpired();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [onSessionExpired]);

    return <>{children}</>;
};

export default SessionWrapper;