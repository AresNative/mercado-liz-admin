"use client"
import { FolderGit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetProjectsQuery } from "@/actions/reducers/api-reducer";
import CreateProjectButton from "@/components/ui/scrum/create-project";
import ProjectCard from "@/components/ui/scrum/project-card";
import RecentProjects from "@/components/ui/scrum/recent-projects";
import SectionHeader from "@/components/ui/scrum/section-header";
import ModalComponent from "@/components/ui/emerging/modal";

export default function ScrumPage() {
    const [data, setdata] = useState([]);
    const router = useRouter();
    const { data: projectsData } = useGetProjectsQuery({ refetchOnMountOrArgChange: true });

    useEffect(() => {
        setdata(projectsData || []);
    }, [projectsData]);

    const handleNavigation = (ruta: string) => router.push(ruta);

    return (
        <div>
            <section className="flex">
                <div className="flex flex-col w-full gap-3">
                    <RecentProjects onNavigate={() => handleNavigation("/Tasks")} />
                    <section className="flex flex-col w-full gap-3">
                        <SectionHeader title="Plantillas - Proyectos" icon={<FolderGit2 />} />
                        <div className="flex flex-wrap gap-3">
                            <CreateProjectButton />
                            {data.map((project: any, key) => (
                                <ProjectCard
                                    key={key}
                                    project={project}
                                    onClick={() => handleNavigation(`/tareas/${project.id}`)}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            <ModalComponent
                title="Nuevo Proyecto"
                message_button="Agregar"
                modalName="add-project"
                functionString="add-project"
            />
        </div>
    );
}