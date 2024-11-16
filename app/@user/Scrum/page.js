"use client";
import { ModalComponent } from "@/components/ui/modal";
import { useAppDispatch } from "@/store/hooks/hooks";
import { openModalReducer } from "@/store/reducers/modal-reducer";
import { useGetProjectsQuery } from "@/store/server/reducers/api-reducer";
import { DefaultPage } from "@/template/default-page";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { Clock8, DiamondPlus, FolderGit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrumPage() {
  const [data, setdata] = useState([]);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleNavigation = (ruta) => {
    router.push(ruta);
  };

  const { data: proyectsData } = useGetProjectsQuery({
    refetchOnMountOrArgChange: true,
  });

  // Maneja los datos recibidos
  useEffect(() => {
    if (proyectsData) {
      setdata(proyectsData);
    } else {
      setdata([]);
    }
  }, [proyectsData]);
  return (
    <DefaultPage>
      <section className="flex">
        <nav className="flex bg-transparent m-3">
          <ul className="flex flex-col decoration-clone p-3 gap-3 font-bold border-r-1 border-r-stone-300">
            <li className="w-20 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
              Sistemas
            </li>
            <li className="w-20 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
              Recibo
            </li>
            <li className="w-20 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
              Almacen
            </li>
          </ul>
        </nav>
        <div className="flex flex-col w-full gap-3">
          <section className="flex flex-col w-full gap-3">
            <h2 className="font-bold text-large flex gap-2 items-center">
              Recientes <Clock8 />
            </h2>
            <div className="flex gap-3 w-full">
              <section
                className="w-[15rem] min-h-[7rem] rounded-lg p-4 bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                onClick={() => handleNavigation("/Tasks")}
              >
                <span>P1</span>
              </section>
            </div>
          </section>
          <section className="flex flex-col w-full gap-3">
            <h2 className="font-bold text-large flex gap-2 items-center">
              Plantillas - Proyectos <FolderGit2 />
            </h2>
            <div className="flex flex-wrap gap-3">
              <section
                className="w-[15rem] min-h-[7rem] bg-slate-200 rounded-lg p-4 flex items-center justify-center hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                role="button"
                onClick={() => {
                  dispatch(
                    openModalReducer({ modalName: "add-project", isOpen: true })
                  );
                }}
              >
                <span className="flex gap-3">
                  Crear nuevo proyecto <DiamondPlus />
                </span>
              </section>

              {data.map((row, key) => (
                <section
                  key={key}
                  className="flex flex-col gap-4 w-[15rem] min-h-[7rem] p-4 rounded-lg bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                  role="button"
                  onClick={() => handleNavigation(`/Scrum/${row.id}`)}
                >
                  <div>
                    <span>{row.nombre}</span>
                  </div>
                  <div className="w-full">
                    <AvatarGroup
                      className="w-fit ml-auto"
                      isBordered
                      max={3}
                      total={10}
                    >
                      <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        className="w-6 h-6 text-tiny"
                      />
                      <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        className="w-6 h-6 text-tiny"
                      />
                      <Avatar
                        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        className="w-6 h-6 text-tiny"
                      />
                    </AvatarGroup>
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      </section>

      <ModalComponent
        title={"Nuevo Proyecto"}
        modalName={"add-project"}
        functionString={"add-project"}
      />
    </DefaultPage>
  );
}
