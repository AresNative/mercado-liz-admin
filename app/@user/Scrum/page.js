"use client";
import { ModalComponent } from "@/components/ui/modal";
import { DefaultPage } from "@/template/default-page";
import { Avatar, AvatarGroup, useDisclosure } from "@nextui-org/react";
import { Clock8, DiamondPlus, FolderGit2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScrumPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const handleNavigation = (ruta) => {
    router.push(ruta);
  };
  return (
    <DefaultPage>
      <section className="flex gap-2">
        <nav className="flex bg-transparent m-3">
          <ul className="flex flex-col decoration-clone p-3 gap-3 font-bold border-r-1 border-r-stone-300">
            <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
              Sistemas
            </li>
            <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
              Recibo
            </li>
            <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105 transition-transform duration-150 ease-in-out">
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
            <div className="flex gap-3 w-full">
              <section
                className="w-[15rem] min-h-[7rem] bg-slate-200 rounded-lg  p-4 flex items-center justify-center hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                role="button"
                onClick={onOpen}
              >
                <span className="flex gap-3">
                  Crear nuevo proyecto <DiamondPlus />
                </span>
              </section>

              <section
                className="w-[15rem] min-h-[7rem] p-4 rounded-lg bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
                role="button"
              >
                <div>
                  <span>P1</span>
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
            </div>
          </section>
        </div>
      </section>

      <ModalComponent isOpen={isOpen} onClose={onClose} />
    </DefaultPage>
  );
}
