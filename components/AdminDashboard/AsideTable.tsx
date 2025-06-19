"use client";

import { useState } from "react";

const menuItems = ["Home Content", "Plant", "Pot", "Port"];

const dummyTableData = [
    { id: 1, name: "Seth Weber", status: "Completed", date: "2024-08-07", price: "$620.10" },
    { id: 2, name: "Connor Roberson", status: "Ongoing", date: "2024-05-11", price: "$120.10" },
    { id: 3, name: "Daniel Gibson", status: "Review", date: "2024-11-04", price: "$420.40" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Home Content");

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-[200px] border-r pr-4">
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li
                            key={item}
                            className={`cursor-pointer ${item === activeTab ? "text-black font-bold" : "text-gray-500"
                                } hover:text-black transition font-medium`}
                            onClick={() => setActiveTab(item)}
                        >
                            {item}
                        </li>

                    ))}
                </ul>
            </aside>

            {/* Content Area */}
            <div className="flex-1 pl-10">
                <h3 className="text-xl font-semibold mb-6">{activeTab}</h3>

                {/* Table */}
                <div className="bg-white overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 font-medium text-gray-600">ID</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-600">Customer</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-600">Date Added</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dummyTableData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={
                                                "font-semibold " +
                                                (item.status === "Completed"
                                                    ? "text-green-600"
                                                    : item.status === "Ongoing"
                                                        ? "text-red-500"
                                                        : item.status === "Review"
                                                            ? "text-purple-500"
                                                            : "")
                                            }
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold">{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
