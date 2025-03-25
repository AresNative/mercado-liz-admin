import { Suspense } from "react"
import { ScrumBoard } from "@/app/scrum/components/scrum-board"
import { getTasks } from "@/app/scrum/lib/data"
import { ActionTabs } from "@/app/scrum/components/action-tabs"
import { FilterSection } from "@/app/scrum/components/filter-section"

export default function ScrumBoardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <ActionTabs activeTab="Compras" />
        <FilterSection />
        <Suspense fallback={<div className="py-10 text-center text-gray-500">Cargando tablero...</div>}>
          <ScrumBoardContent />
        </Suspense>
      </div>
    </div>
  )
}

async function ScrumBoardContent() {
  const tasks = await getTasks()

  return <ScrumBoard initialTasks={tasks} />
}

