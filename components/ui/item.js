import { forwardRef } from "react";

const Item = forwardRef(({ children, ...props }, ref) => (
  <div
    className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow cursor-pointer"
    {...props}
    ref={ref}
  >
    {children}
  </div>
));

Item.displayName = "Item";

export default Item;
