import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GameStatsCharts = ({ users = [], games = [], gameStats = {} }) => {
    const [timeRange, setTimeRange] = useState('daily');
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [userGameData, setUserGameData] = useState([]);

    // 颜色配置
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // 处理统计数据
    useEffect(() => {
        if (!Array.isArray(games) || !Array.isArray(users)) return;

        try {
            // 处理玩游戏次数的饼图数据
            const newPieData = games.map((game, index) => ({
                name: game || 'Unknown',
                value: (gameStats[game] || 0),
                color: COLORS[index % COLORS.length]
            })).filter(item => item.value > 0);
            setPieData(newPieData);

            // 处理用户游戏统计
            const newUserData = users.map(user => {
                if (!user) return null;
                const gameRecords = games.reduce((acc, game) => {
                    if (!game) return acc;
                    acc[game] = (user.gameRecords && user.gameRecords[game]) || 0;
                    return acc;
                }, {});

                return {
                    username: user.username || 'Unknown',
                    ...gameRecords,
                    total: Object.values(user.gameRecords || {}).reduce((a, b) => a + (b || 0), 0)
                };
            }).filter(Boolean);
            setUserGameData(newUserData);

            // 示例时间段数据
            const newTimeData = games.map(game => {
                if (!game) return null;
                return {
                    name: game,
                    [timeRange]: gameStats[game] || 0
                };
            }).filter(Boolean);
            setChartData(newTimeData);

        } catch (error) {
            console.error('Error processing data:', error);
            setPieData([]);
            setUserGameData([]);
            setChartData([]);
        }
    }, [games, gameStats, users, timeRange]);

    // 如果没有数据，显示提示信息
    if (!games?.length || !users?.length) {
        return (
            <Card>
                <CardContent className="py-4">
                    <p className="text-center text-gray-500">暂无统计数据</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* 时间范围选择器 */}
            <div className="flex justify-end mt-6">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="选择时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 游戏次数直方图 */}
            <Card>
                <CardHeader>
                    <CardTitle>游戏次数统计</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={timeRange} fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 游戏比例饼图 */}
            {pieData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>游戏比例分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 用户游戏统计表格 */}
            {userGameData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>用户游戏统计</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">用户名</th>
                                    {games.map(game => game && (
                                        <th key={game} className="px-6 py-3">{game}</th>
                                    ))}
                                    <th className="px-6 py-3">总计</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userGameData.map((userData, index) => (
                                    <tr key={index} className="bg-white border-b">
                                        <td className="px-6 py-4">{userData.username}</td>
                                        {games.map(game => game && (
                                            <td key={game} className="px-6 py-4">
                                                {userData[game] || 0}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4">{userData.total}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default GameStatsCharts;