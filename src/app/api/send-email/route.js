// src/app/api/send-email/route.js
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
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
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { to_email, to_name, from_name, game_name, game_time, message } = body;

        console.log('准备发送邮件:', {
            to: to_email,
            name: to_name,
            game: game_name
        });

        const result = await transporter.sendMail({
            from: '"游戏邀请系统" <2391534566@qq.com>',
            to: to_email,
            subject: `来自 ${from_name} 的游戏邀请`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2>游戏邀请</h2>
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

        console.log('邮件发送成功:', result);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('邮件发送失败:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}