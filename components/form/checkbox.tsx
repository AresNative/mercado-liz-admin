import { InputFormProps } from "@/utils/constants/interfaces";

export function CheckboxComponent(props: InputFormProps) {
    const { cuestion } = props;
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id="terms"
                /* checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)} */
                {
                ...props.register(cuestion.name,
                    cuestion.require
                        ? { required: "The field is required." }
                        : {}
                )
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Acepto los términos y condiciones
            </label>
        </div>
    )
}