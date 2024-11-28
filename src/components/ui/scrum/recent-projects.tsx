import { Clock8 } from "lucide-react";
import SectionHeader from "./section-header";

const RecentProjects = ({ onNavigate }: { onNavigate: () => void }) => (
    <section className="flex flex-col w-full gap-3">
        <SectionHeader title="Recientes" icon={<Clock8 />} />
        <div className="flex gap-3 w-full">
            <section
                className="w-[15rem] min-h-[7rem] rounded-lg p-4 bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                onClick={onNavigate}
            >
                <span>P1</span>
            </section>
        </div>
    </section>
);

export default RecentProjects;
