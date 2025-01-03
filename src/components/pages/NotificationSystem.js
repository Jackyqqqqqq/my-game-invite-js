import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bell } from "lucide-react";

const NotificationSystem = ({ currentUser, notifications, onAccept, onDecline }) => {
    const [showNotification, setShowNotification] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [pendingNotifications, setPendingNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser || !notifications) return;

        console.log('Checking notifications:', {
            total: notifications.length,
            currentUser: currentUser.id
        });

        const currentNotifications = notifications.filter(notification => {
            const isForCurrentUser = notification.recipientId === currentUser.id;
            const isNotHandled = !notification.handled;

            console.log('Checking notification:', {
                notification,
                isForCurrentUser,
                isNotHandled
            });

            return isForCurrentUser && isNotHandled;
        });

        console.log('Filtered notifications:', currentNotifications.length);

        setPendingNotifications(currentNotifications);

        if (currentNotifications.length > 0 && !showNotification) {
            console.log('Setting current notification:', currentNotifications[0]);
            setCurrentNotification(currentNotifications[0]);
            setShowNotification(true);
        }
    }, [notifications, currentUser]);

    const handleAction = (action) => {
        if (!currentNotification) return;

        console.log('Handling action:', { action, notification: currentNotification });

        if (action === 'accept') {
            onAccept(currentNotification);
        } else {
            onDecline(currentNotification);
        }

        const remaining = pendingNotifications.filter(n => n.id !== currentNotification.id);
        setPendingNotifications(remaining);

        if (remaining.length > 0) {
            setCurrentNotification(remaining[0]);
        } else {
            setShowNotification(false);
            setCurrentNotification(null);
        }
    };

    if (!currentUser || pendingNotifications.length === 0) {
        return null;
    }

    return (
        <>
            <div className="fixed top-4 right-4 z-50">
                {pendingNotifications.length > 0 && (
                    <div className="bg-red-500 text-white rounded-full p-2 animate-bounce cursor-pointer"
                         onClick={() => setShowNotification(true)}>
                        <Bell className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 bg-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {pendingNotifications.length}
                        </span>
                    </div>
                )}
            </div>

            <AlertDialog open={showNotification} onOpenChange={setShowNotification}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>游戏邀请</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <div>
                                    <strong>{currentNotification?.senderName}</strong> 邀请你一起玩
                                    <strong> {currentNotification?.game}</strong>
                                </div>
                                <div>时间: {currentNotification && new Date(currentNotification.time).toLocaleString()}</div>
                                {currentNotification?.message && (
                                    <div>附加消息: {currentNotification.message}</div>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleAction('decline')}>
                            拒绝
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('accept')}>
                            接受
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default NotificationSystem;