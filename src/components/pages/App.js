'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import GameInvitePage from './GameInvitePage';
import AdminPage from './AdminPage';
import NotificationSystem from './NotificationSystem';
import SessionWrapper from './SessionWrapper';
import Cookies from 'js-cookie';
import ForgotPasswordPage from './ForgotPasswordPage';

const App = () => {
    // 添加游戏列表状态
    const [games, setGames] = useState([
        "PUBG", "王者荣耀","永劫无间", "CSGO",
    ]);
    const [page, setPage] = useState('login');
    // 在 App.js 中的组件初始化部分
    const [users, setUsers] = useState([{
        id: 1,
        username: 'qyz-admin',
        password: btoa('qyzzyh264263480'), // Base64 加密的默认密码
        email: '2391534566@qq.com',
        isAdmin: true,
        registerTime: new Date().toISOString(),
        gameRecords: {},
        birthday: '2004-08-21'
    }]);

    const [currentUser, setCurrentUser] = useState(null);
    const [gameStats, setGameStats] = useState({});
    const [notifications, setNotifications] = useState([]);
    // 在组件加载时检查会话
    useEffect(() => {
        checkSession();
        loadData();
    }, []);

    // 检查会话状态
    const checkSession = () => {
        const sessionUser = Cookies.get('currentUser');
        if (sessionUser) {
            try {
                const user = JSON.parse(sessionUser);
                setCurrentUser(user);
                setPage(user.isAdmin ? 'admin' : 'game');
            } catch (error) {
                console.error('Session parsing error:', error);
                Cookies.remove('currentUser');
            }
        }
    };
    // 加载存储的数据
    const loadData = () => {
        const savedUsers = localStorage.getItem('users');
        const savedGameStats = localStorage.getItem('gameStats');
        const savedNotifications = localStorage.getItem('notifications');
        const savedGames = localStorage.getItem('games');

        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedGameStats) setGameStats(JSON.parse(savedGameStats));
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
        if (savedGames) setGames(JSON.parse(savedGames));
    };

    // 保存数据
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('gameStats', JSON.stringify(gameStats));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('games', JSON.stringify(games));
    }, [users, gameStats, notifications, games]);


    // 游戏列表更新处理
    const handleUpdateGames = (newGames) => {
        setGames(newGames);
    };

    const handleRegister = (formData) => {
        if (users.some(user => user.username === formData.username)) {
            alert('用户名已存在！');
            return;
        }

        const newUser = {
            ...formData,
            id: Date.now(),
            gameRecords: {},
            joinDate: new Date().toISOString()
        };

        setUsers(prev => [...prev, newUser]);
        alert('注册成功！请登录');
        setPage('login');
    };

    const handleLogin = (formData) => {
        const encodedPassword = btoa(formData.password);
        const user = users.find(u =>
            u.username === formData.username &&
            u.password === encodedPassword
        );

        if (user) {
            setCurrentUser(user);
            // 设置会话 Cookie，有效期 24 小时
            Cookies.set('currentUser', JSON.stringify(user), { expires: 1 });
            setPage(user.isAdmin ? 'admin' : 'game');
            alert('登录成功！');
        } else {
            alert('用户名或密码错误！');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        // 清除会话 Cookie
        Cookies.remove('currentUser');
        setPage('login');
    };


    // 在 App.js 中更新 handleGameInvite 函数
    const handleGameInvite = (data) => {
        console.log('Creating new game invite:', data);

        const newNotification = {
            id: Date.now(),
            ...data,
            handled: false,
            createTime: new Date().toISOString()
        };

        console.log('New notification created:', newNotification);

        setNotifications(prev => {
            const updated = [...prev, newNotification];
            console.log('Updated notifications:', updated);
            return updated;
        });

        // 更新游戏统计
        setGameStats(prev => ({
            ...prev,
            [data.game]: (prev[data.game] || 0) + 1
        }));

        alert('邀请已发送！');
    };

    const handleNotificationAccept = (notification) => {
        setNotifications(prev => prev.map(n =>
            n.id === notification.id ? {...n, handled: true, accepted: true} : n
        ));

        // 更新用户游戏记录
        setUsers(prev => prev.map(user => {
            if (user.id === notification.recipientId) {
                return {
                    ...user,
                    gameRecords: {
                        ...user.gameRecords,
                        [notification.game]: (user.gameRecords[notification.game] || 0) + 1
                    }
                };
            }
            return user;
        }));
    };

    const handleNotificationDecline = (notification) => {
        setNotifications(prev => prev.map(n =>
            n.id === notification.id ? {...n, handled: true, accepted: false} : n
        ));
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('确定要删除这个用户吗？')) {
            setUsers(prev => prev.filter(u => u.id !== userId));
            setNotifications(prev => prev.filter(n =>
                n.recipientId !== userId && n.senderId !== userId
            ));
        }
    };
    // 在 App 组件中添加处理用户更新的函数
    const handleUpdateUser = (updatedUser) => {
        setUsers(prev => prev.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
    };

    const renderPage = () => {
        switch (page) {
            case 'register':
                return <RegisterPage
                    onRegister={handleRegister}
                    onNavigate={setPage}
                />;
            case 'login':
                return <LoginPage
                    onLogin={handleLogin}
                    onNavigate={setPage}
                />;
            case 'forgot-password':
                return <ForgotPasswordPage
                    users={users}
                    onUpdateUser={handleUpdateUser}
                    onNavigate={setPage}
                />;
            case 'game':
                return <GameInvitePage
                    currentUser={currentUser}
                    users={users}
                    games={games}  // 添加 games 属性
                    onLogout={handleLogout}
                    onGameInvite={handleGameInvite}
                />;
            // 在 App.js 的 renderPage 函数中
            case 'admin':
                if (!currentUser?.isAdmin) {
                    setPage('game');
                    return null;
                }
                return <AdminPage
                    users={users}
                    games={games || []}
                    gameStats={gameStats || {}}
                    onDeleteUser={handleDeleteUser}
                    onNavigateBack={() => setPage('game')}
                    onUpdateGames={handleUpdateGames}
                    onUpdateUser={handleUpdateUser}
                />;

            case 'game':
                console.log('Rendering GameInvitePage with:', {
                    currentUser,
                    usersCount: users.length,
                    gamesCount: games.length,
                    games
                });
                return <GameInvitePage
                    currentUser={currentUser}
                    users={users}
                    games={games}
                    onLogout={handleLogout}
                    onGameInvite={handleGameInvite}
                />;
            default:
                return <LoginPage
                    onLogin={handleLogin}
                    onNavigate={setPage}
                />;
        }
    };

    // 在 App.js 的 return 语句中包装主要内容
    return (
        <SessionWrapper onSessionExpired={handleLogout}>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    {currentUser && (
                        <Card className="mb-4 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <span>当前用户: {currentUser.username}</span>
                                {currentUser.isAdmin && (
                                    <button
                                        onClick={() => setPage('admin')}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        管理面板
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-700"
                            >
                                退出登录
                            </button>
                        </Card>
                    )}

                    {currentUser && (
                        <NotificationSystem
                            currentUser={currentUser}
                            notifications={notifications}
                            onAccept={handleNotificationAccept}
                            onDecline={handleNotificationDecline}
                        />
                    )}

                    <div className="max-w-4xl mx-auto">
                        {renderPage()}
                    </div>

                    {/* 水印 */}
                    <div className="fixed bottom-6 right-10 text-gray-300 text-3xl font-serif italic select-none watermark transition-all duration-300 hover:text-gray-400 hover:scale-110"
                        style={{
                        color: '#4F46E5', // 靛蓝色
                        textShadow: '0 0 10px rgba(79, 70, 229, 0.3)' // 发光效果
                        }}>
                        @Jacky QYZ
                    </div>
                </div>
            </div>
        </SessionWrapper>
    );
};

export default App;