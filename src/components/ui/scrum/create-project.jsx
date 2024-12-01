import { openModal } from "@/actions/reducers/modal-reducer";
import { useAppDispatch } from "@/actions/selector";
import { DiamondPlus } from "lucide-react";
const CreateProjectButton = () => {
    const dispatch = useAppDispatch();

    return (
        <section
            className="w-[15rem] min-h-[7rem] bg-slate-200 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center hover:bg-opacity-85 cursor-pointer transform active:scale-105 transition-transform duration-150 ease-in-out"
            role="button"
            onClick={() => dispatch(openModal({ modalName: "add-project", isOpen: true }))}
        >
            <span className="flex gap-3">
                Crear nuevo proyecto <DiamondPlus />
            </span>
        </section>
    );
};

export default CreateProjectButton;
