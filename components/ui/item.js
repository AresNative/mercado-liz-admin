// components/Item.js
import { GripVertical } from "lucide-react";
import React from "react";

function Item({ id }) {
  return (
    <div className="min-h-15 flex items-center p-4 bg-white dark:bg-neutral-600 shadow-lg rounded border dark:border-neutral-500">
      <GripVertical className="mr-2 text-neutral-500 dark:text-neutral-300" />
      <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {id}
      </span>
    </div>
  );
}

export default React.memo(Item);
