"use client"
import FileList from "@/components/ui/filelist";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Filter, RotateCw, Search } from "lucide-react";
const files = [
    { name: "config.json", extension: "json", size: "2.3 KB" },
    { name: "app.tsx", extension: "tsx", size: "4.1 KB" },
    { name: "styles.css", extension: "css", size: "1.8 KB" },
    { name: "utils.ts", extension: "ts", size: "892 B" },
    { name: "README.md", extension: "md", size: "4.2 KB" },
    { name: "logo.svg", extension: "svg", size: "3.1 KB" },
    { name: "index.js", extension: "js", size: "1.5 KB" },
    { name: "types.d.ts", extension: "ts", size: "567 B" },
];
export default function Page() {

    return (
        <>
            <nav>
                <ul className="flex gap-2 m-2 items-center">
                    <li>
                        <Input
                            isClearable
                            label="Buscador"
                            className="max-w-xs"
                            placeholder="Escribe para buscar..."
                            startContent={<Search />}
                        />
                    </li>
                    <li className="min-w-44">
                        <Select
                            label="Departamento"
                            startContent={<Filter />}
                            defaultSelectedKeys={["cat"]}
                            placeholder="Selecciona un departamento"
                            items={[
                                { value: "get-compras", label: "Compras" },
                                { value: "get-ventas", label: "Ventas" },
                                { value: "get-rh", label: "Rh" },
                                { value: "get-recibo", label: "Recibo" },
                                { value: "get-administracion", label: "Administracion" },
                            ]}
                        >
                            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                        </Select>
                    </li>
                    <li className="ml-auto">
                        <Button isIconOnly color="secondary" variant="faded" aria-label="Take a photo">
                            <RotateCw />
                        </Button>
                    </li>
                </ul>
            </nav>
            <FileList files={files} isGrid />
        </>
    )
}