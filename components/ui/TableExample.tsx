import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue, Spinner } from "@nextui-org/react";
import { EyeIcon } from "@/assets/icons/eyeicon";
import { EditIcon } from "@/assets/icons/editicon";
import { DeleteIcon } from "@/assets/icons/deleteicon";
import { useAsyncList } from "@react-stately/data";
import { columns, users } from "@/data/data";

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

type User = typeof users[0];

export default function TableExample() {
    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const [isLoading, setIsLoading] = React.useState(true);


    /* 
        !uso de endpoints
        let list = useAsyncList({
                async load({ signal }) {
                    let res = await fetch('https://swapi.py4e.com/api/people/?search', {
                        signal,
                    });
                    let json = await res.json();
                    setIsLoading(false);
            return {
                items: json,
            };
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: any, b: any) => {
                    let first = a[sortDescriptor.column!];
                    let second = b[sortDescriptor.column!];
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
        });
    */
    let list = useAsyncList({
        async load({ signal }) {
            // Cargando los datos de usuarios
            // Se asume que users es una variable disponible en el componente que contiene el listado
            setIsLoading(false);

            return {
                items: users, // Usa el listado de usuarios proporcionado
            };
        },

        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: any, b: any) => {
                    let first = a[sortDescriptor.column!];
                    let second = b[sortDescriptor.column!];

                    // Si son números, se intenta convertir, de lo contrario, se compara como cadenas
                    let firstValue = isNaN(first) ? first : parseInt(first);
                    let secondValue = isNaN(second) ? second : parseInt(second);

                    // Comparación básica (ascendente)
                    let cmp = firstValue < secondValue ? -1 : 1;

                    // Invertir si la dirección es descendente
                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });


    return (
        <Table aria-label="Example table with custom cells"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}>
            <TableHeader
                columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} allowsSorting align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={list.items}
                isLoading={isLoading}
                loadingContent={<Spinner label="Loading..." />}>
                {(item: any) => (
                    <TableRow key={item.name}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
