// /api/send-email/route.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// 创建重试函数
async function retry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry(fn, retries - 1, delay * 2);
    }
}

// 验证邮箱配置
function validateEmailConfig() {
    const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}

// 创建邮件传输器工厂函数
function createTransporter() {
    // 首先尝试 QQ 邮箱配置
    const qqConfig = {
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    // 如果环境变量指定了其他邮箱服务，使用对应配置
    const emailService = process.env.EMAIL_SERVICE?.toLowerCase();
    if (emailService === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else if (emailService === '163') {
        return nodemailer.createTransport({
            host: 'smtp.163.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // 默认使用 QQ 邮箱配置
    return nodemailer.createTransport(qqConfig);
}

// 添加速率限制
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 3600000; // 1小时
const MAX_EMAILS_PER_WINDOW = 10;

// 速率限制检查函数
function checkRateLimit(email) {
    const now = Date.now();
    const userHistory = rateLimit.get(email) || [];
    const recentEmails = userHistory.filter(time => time > now - RATE_LIMIT_WINDOW);

    if (recentEmails.length >= MAX_EMAILS_PER_WINDOW) {
        throw new Error('发送频率过高，请稍后再试');
    }

    recentEmails.push(now);
    rateLimit.set(email, recentEmails);
}

export async function POST(request) {
    try {
        // 验证环境变量配置
        validateEmailConfig();

        const body = await request.json();
        const { to_email, to_name, from_name, game_name, game_time, message } = body;

        // 验证必需字段
        if (!to_email || !to_name || !from_name || !game_name || !game_time) {
            return NextResponse.json(
                { success: false, error: '缺少必需的字段' },
                { status: 400 }
            );
        }

        // 检查速率限制
        try {
            checkRateLimit(to_email);
        } catch (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 429 }
            );
        }

        // 创建传输器
        const transporter = createTransporter();

        // 使用重试机制发送邮件
        await retry(async () => {
            await transporter.sendMail({
                from: `"游戏邀请系统" <${process.env.EMAIL_USER}>`,
                to: to_email,
                subject: `来自 ${from_name} 的游戏邀请`,
                html: `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                        <h2 style="color: #4F46E5;">游戏邀请</h2>
                        <p>亲爱的 ${to_name}：</p>
                        <p>${from_name} 邀请您一起玩 ${game_name}！</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>游戏：</strong>${game_name}</p>
                            <p style="margin: 5px 0;"><strong>时间：</strong>${game_time}</p>
                            ${message ? `<p style="margin: 5px 0;"><strong>附加消息：</strong>${message}</p>` : ''}
                        </div>
                        <p>祝您玩得开心！</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">此邮件由游戏邀请系统自动发送，请勿直接回复。</p>
                    </div>
                `
            });
        });

        return NextResponse.json({
            success: true,
            message: '邮件发送成功'
        });

    } catch (error) {
        console.error('邮件发送失败:', error);

        // 根据错误类型返回适当的错误信息
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : '邮件发送失败，请稍后重试';

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                detail: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: error.status || 500 }
        );
    }
}