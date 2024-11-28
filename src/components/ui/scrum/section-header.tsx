import { ReactNode } from "react";

const SectionHeader = ({ title, icon }: { title: string; icon: ReactNode }) => (
    <h2 className="font-bold text-large flex gap-2 items-center">
        {title} {icon}
    </h2>
);

export default SectionHeader;
