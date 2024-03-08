import { Skeleton } from "antd";


export const HeaderSkeleton = () => {
    return (
        <div className="flex justify-center items-center mt-2 w-full">
            <div className="w-3/4"><Skeleton.Input active block /></div>
        </div>
    );
};

