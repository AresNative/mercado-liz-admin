import { Avatar, AvatarGroup } from "@nextui-org/react";

const ProjectCard = ({ project, onClick }: { project: any; onClick: () => void }) => (
    <section
        className="flex flex-col gap-4 w-[15rem] min-h-[7rem] p-4 rounded-lg bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
        role="button"
        onClick={onClick}
    >
        <div>
            <span>{project.nombre}</span>
        </div>
        <div className="w-full">
            <AvatarGroup className="w-fit ml-auto" isBordered max={3} total={10}>
                {Array(3).fill("").map((_, i) => (
                    <Avatar
                        key={i}
                        src={`https://i.pravatar.cc/150?u=a042581f4e29026024d${i}`}
                        className="w-6 h-6 text-tiny"
                    />
                ))}
            </AvatarGroup>
        </div>
    </section>
);

export default ProjectCard;
