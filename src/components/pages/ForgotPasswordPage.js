import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = ({ users, onUpdateUser, onNavigate }) => {
    const [step, setStep] = useState('verify'); // verify, reset
    const [form, setForm] = useState({
        username: '',
        securityQuestion: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [error, setError] = useState('');

    const handleVerify = (e) => {
        e.preventDefault();
        const user = users.find(u => u.username === form.username);

        if (!user) {
            setError('用户名不存在');
            return;
        }

        if (!user.securityQuestion || user.securityQuestion !== form.securityQuestion) {
            setError('安全问题答案错误');
            return;
        }

        setVerifiedUser(user);
        setStep('reset');
        setError('');
    };

    const handleReset = (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        if (form.newPassword.length < 6) {
            setError('密码长度至少为6位');
            return;
        }

        onUpdateUser({
            ...verifiedUser,
            password: form.newPassword
        });

        alert('密码重置成功！请使用新密码登录');
        onNavigate('login');
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>找回密码</CardTitle>
                <CardDescription>
                    {step === 'verify' ? '请验证您的身份' : '请设置新密码'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="text-red-500 mb-4 text-sm">
                        {error}
                    </div>
                )}

                {step === 'verify' ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">用户名</Label>
                            <Input
                                id="username"
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="securityQuestion">
                                您的第一个宠物的名字是什么？（安全问题）
                            </Label>
                            <Input
                                id="securityQuestion"
                                value={form.securityQuestion}
                                onChange={(e) => setForm({...form, securityQuestion: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Button type="submit" className="w-full">
                                验证身份
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => onNavigate('login')}
                            >
                                返回登录
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">新密码</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={(e) => setForm({...form, newPassword: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">确认新密码</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Button type="submit" className="w-full">
                                重置密码
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordPage;