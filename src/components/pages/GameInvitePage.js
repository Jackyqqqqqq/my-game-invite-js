import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const GameInvitePage = ({ currentUser, users = [], games = [], onLogout, onGameInvite }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sendEmail, setSendEmail] = useState(false);
    const [form, setForm] = useState({
        game: '',
        time: '',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleSendInvite = async () => {
        if (selectedUsers.length === 0) {
            alert('请选择至少一个接收用户');
            return;
        }
        if (!form.game || !form.time) {
            alert('请选择游戏和时间');
            return;
        }

        setIsSending(true);
        try {
            for (const userId of selectedUsers) {
                const recipient = users.find(u => u.id === userId);
                if (recipient) {
                    // 发送游戏邀请
                    onGameInvite({
                        recipientId: userId,
                        recipientName: recipient.username,
                        ...form,
                        senderId: currentUser?.id,
                        senderName: currentUser?.username,
                        timestamp: new Date().toISOString()
                    });

                    // 如果选择发送邮件且接收者有邮箱
                    if (sendEmail && recipient.email) {
                        try {
                            const emailData = {
                                to_email: recipient.email,
                                to_name: recipient.username,
                                from_name: currentUser?.username,
                                game_name: form.game,
                                game_time: new Date(form.time).toLocaleString(),
                                message: form.message
                            };

                            console.log('正在发送邮件:', emailData);

                            const response = await fetch('/api/send-email', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(emailData)
                            });

                            const data = await response.json();

                            if (!response.ok) {
                                let errorMessage = data.error || '邮件发送失败';
                                if (response.status === 429) {
                                    errorMessage = '发送频率过高，请稍后再试';
                                }
                                throw new Error(errorMessage);
                            }

                            console.log('邮件发送成功:', data);
                        } catch (error) {
                            console.error('邮件发送错误:', error);

                            // 使用更友好的错误提示
                            let errorMessage = '邮件发送失败';
                            if (error.message.includes('频率过高')) {
                                errorMessage = '发送频率过高，请稍后再试';
                            } else if (error.message.includes('Invalid recipient')) {
                                errorMessage = '收件人邮箱地址无效';
                            } else if (error.message.includes('Authentication failed')) {
                                errorMessage = '邮件服务器认证失败，请联系管理员';
                            }

                            alert(`发送邮件给 ${recipient.username} 失败: ${errorMessage}`);
                        }
                    }
                }
            }

            alert(`消息已发送给 ${selectedUsers.length} 位用户`);
            setForm({ game: '', time: '', message: '' });
            setSelectedUsers([]);
            setSendEmail(false);
        } catch (error) {
            console.error('发送失败:', error);
            alert('发送失败，请重试');
        } finally {
            setIsSending(false);
        }
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // 确保 users 和 games 存在且是数组
    const validUsers = Array.isArray(users) ? users : [];
    const validGames = Array.isArray(games) ? games : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>发送游戏邀请</CardTitle>
                <CardDescription>选择好友发送游戏邀请</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>选择接收用户</Label>
                    <div className="grid grid-cols-2 gap-2 border rounded-lg p-4">
                        {validUsers
                            .filter(user => user.id !== currentUser?.id)
                            .map(user => (
                                <div key={user.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={`user-${user.id}`}>{user.username}</Label>
                                    {user.email && (
                                        <span className="text-sm text-gray-500">{user.email}</span>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>选择游戏</Label>
                    <Select
                        value={form.game}
                        onValueChange={(value) => setForm({...form, game: value})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="选择游戏" />
                        </SelectTrigger>
                        <SelectContent>
                            {validGames.map(game => (
                                <SelectItem key={game} value={game}>{game}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>游戏时间</Label>
                    <Input
                        type="datetime-local"
                        value={form.time}
                        onChange={(e) => setForm({...form, time: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label>附加消息</Label>
                    <Input
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                        placeholder="输入额外消息内容..."
                    />
                </div>

                <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                        id="sendEmail"
                        checked={sendEmail}
                        onCheckedChange={setSendEmail}
                    />
                    <Label htmlFor="sendEmail">同时发送邮件通知</Label>
                </div>

                <Button
                    onClick={handleSendInvite}
                    className="w-full"
                    disabled={isSending}
                >
                    {isSending ? '发送中...' : '发送邀请'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default GameInvitePage;