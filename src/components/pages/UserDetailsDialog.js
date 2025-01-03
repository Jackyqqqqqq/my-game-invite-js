import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const UserDetailsDialog = ({ user, open, onOpenChange }) => {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>用户详细信息</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">用户名</label>
                            <p className="mt-1">{user.username}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">邮箱</label>
                            <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">生日</label>
                            <p className="mt-1">{user.birthday}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">注册时间</label>
                            <p className="mt-1">{new Date(user.registerTime).toLocaleString()}</p>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium">加密密码</label>
                            <p className="mt-1 break-all">{user.password}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsDialog;