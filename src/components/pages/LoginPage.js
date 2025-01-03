import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = ({ onLogin, onNavigate }) => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            alert('请填写用户名和密码');
            return;
        }
        onLogin(form);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>用户登录</CardTitle>
                <CardDescription>登录您的账号</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input
                            id="username"
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">密码</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Button type="submit" className="w-full">
                            登录
                        </Button>
                        <div className="flex justify-between items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-sm text-blue-500 hover:text-blue-700"
                                onClick={() => onNavigate('forgot-password')}
                            >
                                忘记密码？
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-sm text-blue-500 hover:text-blue-700"
                                onClick={() => onNavigate('register')}
                            >
                                没有账号？去注册
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginPage;