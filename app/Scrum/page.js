import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { Clock8, DiamondPlus, FolderGit2 } from "lucide-react";

export default function PageScrum() {
  /* 
  ! añadir estados de proyecto
  ! añadir miembros de cada proyecto
  // dividir las areas por colores
  */
  return (
    <main className="flex p-3 gap-2">
      <nav className="flex bg-transparent m-3">
        <ul className="flex flex-col decoration-clone p-3 gap-3 font-bold border-r-1 border-r-stone-300">
          <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105">
            Sistemas
          </li>
          <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105">
            Recibo
          </li>
          <li className="w-24 hover:text-purple-500 cursor-pointer active:scale-105">
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
            <Card
              className="w-[15rem] min-h-[7rem] p-4 bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
              role="button"
            >
              <span>P1</span>
            </Card>
          </div>
        </section>
        <section className="flex flex-col w-full gap-3">
          <h2 className="font-bold text-large flex gap-2 items-center">
            Plantillas - Proyectos <FolderGit2 />
          </h2>
          <div className="flex gap-3 w-full">
            <Card
              className="w-[15rem] min-h-[7rem] p-4 flex items-center justify-center hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
              role="button"
            >
              <span className="flex gap-3">
                Crear nuevo proyecto <DiamondPlus />
              </span>
            </Card>

            <Card
              className="w-[15rem] min-h-[7rem] bg-purple-700 text-neutral-100 hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
              role="button"
            >
              <CardBody>
                <span>P1</span>
              </CardBody>
              <CardFooter className="w-full">
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
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
