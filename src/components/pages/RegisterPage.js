import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterPage = ({ onRegister, onNavigate }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthday: '',
        selectedQuestion: '',
        securityAnswer: '',
        isAdmin: false
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!form.username) {
            newErrors.username = '请输入用户名';
        } else if (form.username.length < 3) {
            newErrors.username = '用户名至少需要3个字符';
        }

        if (!form.password) {
            newErrors.password = '请输入密码';
        } else if (form.password.length < 6) {
            newErrors.password = '密码至少需要6个字符';
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = '两次输入的密码不一致';
        }

        if (!form.email) {
            newErrors.email = '请输入邮箱';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = '请输入有效的邮箱地址';
        }

        if (!form.birthday) {
            newErrors.birthday = '请选择生日';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Base64 加密密码
            const encodedPassword = btoa(form.password);
            const { confirmPassword, ...registerData } = form;

            onRegister({
                ...registerData,
                password: encodedPassword,
                registerTime: new Date().toISOString()
            });
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>用户注册</CardTitle>
                <CardDescription>创建您的新账号</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input
                            id="username"
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            className={errors.username ? 'border-red-500' : ''}
                        />
                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="birthday">生日</Label>
                        <Input
                            id="birthday"
                            type="date"
                            value={form.birthday}
                            onChange={(e) => setForm({...form, birthday: e.target.value})}
                            className={errors.birthday ? 'border-red-500' : ''}
                        />
                        {errors.birthday && <p className="text-sm text-red-500">{errors.birthday}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">密码</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认密码</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-2 pt-2">
                        <Button type="submit" className="w-full">
                            注册
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate('login')}
                        >
                            已有账号？去登录
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterPage;