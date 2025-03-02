
import { Link } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";

import { useFetchQuery } from "../../hook/useFetchQuery";
import WorkspaceCard from "../../components/card/WorkspaceCard";
import InvitedCard from "../../components/card/InvitedCard";




interface WorkspaceCard {
    workspaceId: string;
    name: string;
    description: string;
    createById: string;
    createdAt: string;
    updatedAt: string;
    members: {
      id: number;
      role: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: number;
        googleId: string;
        email: string;
        name: string;
        picture: string;
      };
    }[];
  }

function WorkspaceList() {
    const {
        data: myWorkspace,
        isLoading: isLoadingMyWorkspace,
        error: errorMyWorkspace,
    } = useFetchQuery(
        ["all-workspaces",],
        `/workspaces/all`
    );
    if (isLoadingMyWorkspace) return <div>Loading...</div>;

    if (errorMyWorkspace) return <div>Error: {errorMyWorkspace?.message}</div>;
    return (
        <>
            <div className="flex bg-neutral-100 h-full pb-32  min-h-screen ">
                {/* Slidebar placeholder */}
                <AdminSidebar></AdminSidebar>
                <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
                    {/* Top card (create sort workspace name) */}
                    <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
                        <div className="flex justify-between items-center p-5">
                            <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                                รายชื่อ Workspace
                            </h1>
                        </div>
                        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
                        <div className="m-6 flex justify-between items-center gap-4">
                            <input
                                type="text"
                                id="first_name"
                                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                                placeholder="Search with AI name"
                                required
                            />
                            <div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 h-fit w-[95%] bg-white rounded-[15px] items-center relative p-6">
                        {/* Card container */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-8 pt-2`}>
                            {myWorkspace.map((data:WorkspaceCard) => (
                                <div>
                                    <Link to={`/workspaces/${data.workspaceId}/project-list`}>
                                        <InvitedCard {...data}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <MiniFooter />
        </>
    );
};

export default WorkspaceList;