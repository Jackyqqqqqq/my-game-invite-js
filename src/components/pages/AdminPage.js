import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import GameStatsCharts from "./GameStatsCharts";
import UserDetailsDialog from "./UserDetailsDialog";

const AdminPage = ({ users, games, gameStats, onDeleteUser, onNavigateBack, onUpdateGames }) => {
    const [showAddGame, setShowAddGame] = useState(false);
    const [newGame, setNewGame] = useState('');
    const [editingGame, setEditingGame] = useState(null);
    const totalGames = Object.values(gameStats).reduce((acc, count) => acc + count, 0);
    // 添加状态和处理函数
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowDetails(true);
    };

    const handleAddGame = () => {
        if (newGame.trim()) {
            onUpdateGames([...games, newGame.trim()]);
            setNewGame('');
            setShowAddGame(false);
        }
    };

    const handleDeleteGame = (gameToDelete) => {
        if (window.confirm('确定要删除这个游戏吗？相关的统计记录也会被删除。')) {
            // 更新游戏列表
            const updatedGames = games.filter(game => game !== gameToDelete);
            onUpdateGames(updatedGames);

            // 删除统计数据
            const updatedStats = { ...gameStats };
            delete updatedStats[gameToDelete];
            onUpdateGameStats(updatedStats);

            // 从用户记录中删除该游戏的记录
            onUpdateUserGameRecords(gameToDelete);
        }
    };

    const handleEditGame = (oldGame, newGameName) => {
        if (newGameName.trim() && newGameName !== oldGame) {
            const updatedGames = games.map(game =>
                game === oldGame ? newGameName.trim() : game
            );
            onUpdateGames(updatedGames);

            // 更新统计数据的游戏名称
            const updatedStats = { ...gameStats };
            if (updatedStats[oldGame] !== undefined) {
                updatedStats[newGameName] = updatedStats[oldGame];
                delete updatedStats[oldGame];
                onUpdateGameStats(updatedStats);
            }
        }
        setEditingGame(null);
        setNewGame('');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">管理员控制面板</h2>
                <Button variant="outline" onClick={onNavigateBack}>
                    返回游戏页面
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="users">用户管理</TabsTrigger>
                            <TabsTrigger value="games">游戏管理</TabsTrigger>
                            <TabsTrigger value="stats">游戏统计</TabsTrigger>
                        </TabsList>

                        {/* 用户管理标签页 */}
                        <TabsContent value="users">
                            <div className="relative overflow-x-auto rounded-lg border mt-4">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">用户名</th>
                                        <th className="px-6 py-3">角色</th>
                                        <th className="px-6 py-3">游戏记录</th>
                                        <th className="px-6 py-3">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="bg-white border-b">
                                            <td className="px-6 py-4">{user.username}</td>
                                            <td className="px-6 py-4">
                                                {user.isAdmin ? '管理员' : '普通用户'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {Object.entries(user.gameRecords || {}).map(([game, count]) => (
                                                    <div key={game}>
                                                        {game}: {count}次
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(user)}
                                                >
                                                    查看详情
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onDeleteUser(user.id)}
                                                >
                                                    删除
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <UserDetailsDialog
                                user={selectedUser}
                                open={showDetails}
                                onOpenChange={setShowDetails}
                            />
                        </TabsContent>

                        {/* 游戏管理标签页 */}
                        <TabsContent value="games">
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">游戏列表</h3>
                                    <Button onClick={() => setShowAddGame(true)}>
                                        添加游戏
                                    </Button>
                                </div>
                                <div className="grid gap-4">
                                    {games.map(game => (
                                        <Card key={game}>
                                            <CardContent className="flex justify-between items-center p-4">
                                                {editingGame === game ? (
                                                    <div className="flex gap-2 flex-1">
                                                        <Input
                                                            value={newGame}
                                                            onChange={(e) => setNewGame(e.target.value)}
                                                            placeholder="输入新的游戏名称"
                                                        />
                                                        <Button onClick={() => handleEditGame(game, newGame)}>
                                                            保存
                                                        </Button>
                                                        <Button variant="outline" onClick={() => setEditingGame(null)}>
                                                            取消
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{game}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingGame(game);
                                                                    setNewGame(game);
                                                                }}
                                                            >
                                                                编辑
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteGame(game)}
                                                            >
                                                                删除
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* 游戏统计标签页 */}
                        <TabsContent value="stats">
                            <div className="relative overflow-x-auto rounded-lg border mt-4">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">游戏名称</th>
                                        <th className="px-6 py-3">总邀请次数</th>
                                        <th className="px-6 py-3">活跃度占比</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {games.map(game => {
                                        // 只计算现存游戏的数量
                                        const count = gameStats[game] || 0;
                                        // 计算现存游戏的总数
                                        const currentTotal = games.reduce((acc, g) => acc + (gameStats[g] || 0), 0);
                                        // 计算百分比
                                        const percentage = currentTotal === 0
                                            ? 0
                                            : ((count / currentTotal) * 100).toFixed(1);

                                        return (
                                            <tr key={game} className="bg-white border-b">
                                                <td className="px-6 py-4">{game}</td>
                                                <td className="px-6 py-4">{count}</td>
                                                <td className="px-6 py-4">{percentage}%</td>
                                            </tr>
                                        );
                                    })}
                                    {/* 总计行只显示现存游戏的总数 */}
                                    <tr className="bg-gray-50 font_medium">
                                        <td className="px-6 py-4">总计</td>
                                        <td className="px-6 py-4">
                                            {games.reduce((acc, game) => acc + (gameStats[game] || 0), 0)}
                                        </td>
                                        <td className="px-6 py-4">100%</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <GameStatsCharts
                                users={users}
                                games={games}
                                gameStats={gameStats}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* 添加游戏对话框 */}
            <AlertDialog open={showAddGame} onOpenChange={setShowAddGame}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>添加新游戏</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Input
                                value={newGame}
                                onChange={(e) => setNewGame(e.target.value)}
                                placeholder="输入游戏名称"
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowAddGame(false)}>
                            取消
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleAddGame}>
                            添加
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminPage;