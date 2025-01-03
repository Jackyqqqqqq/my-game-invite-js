import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterPage = ({ onRegister, onNavigate }) => {
    // 安全问题列表
    const securityQuestions = [
        "您的第一个宠物叫什么名字？",
        "您最喜欢的小学老师姓名是？",
        "您最喜欢的电影是？",
        "您的出生地是？",
        "您母亲的姓名是？"
    ];

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthday: '',
        securityQuestion: '',
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

        // 如果选择了安全问题但没有填写答案
        if (form.securityQuestion && !form.securityAnswer) {
            newErrors.securityAnswer = '请输入安全问题答案';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
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
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input
                            id="username"
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            className={errors.username ? 'border-red-500' : ''}
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="new-password"
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
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>安全问题（可选）</Label>
                        <Select
                            value={form.securityQuestion}
                            onValueChange={(value) => setForm({...form, securityQuestion: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="选择安全问题" />
                            </SelectTrigger>
                            <SelectContent>
                                {securityQuestions.map((question, index) => (
                                    <SelectItem key={index} value={question}>
                                        {question}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {form.securityQuestion && (
                        <div className="space-y-2">
                            <Label htmlFor="securityAnswer">安全问题答案</Label>
                            <Input
                                id="securityAnswer"
                                value={form.securityAnswer}
                                onChange={(e) => setForm({...form, securityAnswer: e.target.value})}
                                className={errors.securityAnswer ? 'border-red-500' : ''}
                                autoComplete="off"
                            />
                            {errors.securityAnswer && <p className="text-sm text-red-500">{errors.securityAnswer}</p>}
                        </div>
                    )}

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