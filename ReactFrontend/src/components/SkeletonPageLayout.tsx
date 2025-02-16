
import { Skeleton, Box } from "@mui/material";

const SkeletonLayout = () => {
  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar Skeleton */}
      <div className="w-1/4 bg-white p-5 border-r border-gray-300">
        <Skeleton variant="rectangular" width="80%" height={30} className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height={200} className="mb-6" />
        <Skeleton variant="rectangular" width="60%" height={25} className="mb-2" />
        <Skeleton variant="rectangular" width="80%" height={25} className="mb-2" />
        <Skeleton variant="rectangular" width="70%" height={25} className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height={30} className="mb-4" />
      </div>

      {/* Content Skeleton */}
      <div className="w-3/4 p-8">
        <Skeleton variant="rectangular" width="50%" height={40} className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height={250} className="mb-6" />
        <Box display="flex" gap={2}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box>
            <Skeleton variant="text" width={120} height={25} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" width="90%" height={100} className="mt-6" />
      </div>
    </div>
  );
};

export default SkeletonLayout;