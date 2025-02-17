import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";
import { Button, CircularProgress } from "@mui/material";
import { useFetchQuery } from "../../hook/useFetchQuery";
import WorkspaceCard from "../../components/card/WorkspaceCard";

const WorkspaceList = () => {
    const {
        data: workspaces,
        isLoading,
        error,
    } = useFetchQuery(["workspaces"], `/workspaces/all`);

    const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // ใช้ useEffect ในการอัปเดต workspace เมื่อค้นหา
    useEffect(() => {
        if (workspaces) {
            setFilteredWorkspaces(
                workspaces.filter((workspace) =>
                    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, workspaces]);

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress color="primary" />
            </div>
        );
    }

    // Handle error state
    if (error) {
        return <div className="text-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <>
            <div className="flex bg-neutral-100 h-full pb-32 min-h-screen">
                {/* Sidebar */}
                <AdminSidebar />

                <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
                    {/* Top card */}
                    <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px]">
                        <div className="flex justify-between items-center p-5">
                            <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
                                รายชื่อ Workspace
                            </h1>
                        </div>
                        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

                        {/* Search Bar */}
                        <div className="m-6 flex justify-between items-center gap-4">
                            <input
                                type="text"
                                className="w-6/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ค้นหาด้วยชื่อ Workspace"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Workspace List */}
                    <div className="mt-4 h-fit w-[95%] bg-white rounded-[15px] p-6">
                        {filteredWorkspaces.length === 0 ? (
                            <div className="text-center text-gray-600 text-lg">ไม่มี Workspace ที่ตรงกับการค้นหา</div>
                        ) : (
                            <div className="grid grid-cols-3 pb-8 pt-2 gap-6">
                                {filteredWorkspaces
                                    .sort((a, b) => a.name.localeCompare(b.name)) // ✅ Sort ตามชื่อ Workspace
                                    .map((data) => (
                                        <Link key={data.workspaceId} to={`/workspaces/${data.workspaceId}/project-list`}>
                                            <WorkspaceCard
                                                id={data.workspaceId}
                                                name={data.name}
                                                description={data.description}
                                                members={data.members}
                                                updatedAt={data.updatedAt}
                                                createdAt={data.createdAt}
                                                createById={data.createById}
                                            />
                                        </Link>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <MiniFooter />
        </>
    );
};

export default WorkspaceList;
