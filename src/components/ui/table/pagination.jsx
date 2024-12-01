import { Button } from "@nextui-org/react";

const PaginationTable = ({currentPage, itemsPerPage, totalRecords, handlePageChange}) => {    
    return (<div className="flex justify-between items-center mt-4">
                <span>
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, totalRecords)} de{" "}
                    {totalRecords}
                </span>
                <div className="flex gap-2">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                            currentPage === Math.ceil(totalRecords / itemsPerPage)
                        }
                    >
                        Siguiente
                    </Button>
                </div>
            </div>)
}

export default PaginationTable;