"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PMTaskInput {
  id: string
  componentName: string
  resetIntervalDays: number
  alertThresholdDays: number
}

interface AddEquipmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (equipment: { name: string; tasks: PMTaskInput[] }) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function AddEquipmentModal({ open, onOpenChange, onSave }: AddEquipmentModalProps) {
  const [equipmentName, setEquipmentName] = useState("")
  const [tasks, setTasks] = useState<PMTaskInput[]>([
    { id: generateId(), componentName: "", resetIntervalDays: 30, alertThresholdDays: 5 },
  ])

  const addTask = () => {
    if (tasks.length < 5) {
      setTasks([
        ...tasks,
        { id: generateId(), componentName: "", resetIntervalDays: 30, alertThresholdDays: 5 },
      ])
    }
  }

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  const updateTask = (id: string, field: keyof PMTaskInput, value: string | number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    )
  }

  const handleSave = () => {
    if (equipmentName.trim() && tasks.some((t) => t.componentName.trim())) {
      onSave({
        name: equipmentName.trim(),
        tasks: tasks.filter((t) => t.componentName.trim()),
      })
      setEquipmentName("")
      setTasks([
        { id: generateId(), componentName: "", resetIntervalDays: 30, alertThresholdDays: 5 },
      ])
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setEquipmentName("")
    setTasks([
      { id: generateId(), componentName: "", resetIntervalDays: 30, alertThresholdDays: 5 },
    ])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold">Add Equipment</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up a new piece of equipment with maintenance schedules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="equipment-name" className="text-sm font-medium">
              Equipment Name
            </Label>
            <Input
              id="equipment-name"
              placeholder="e.g., Assembly Line 1"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="h-11 rounded-xl bg-muted/50 border-border focus:bg-card"
            />
          </div>

          {/* PM Components */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Components</Label>
              <span className="text-xs text-muted-foreground">
                {tasks.length} of 5
              </span>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Component {index + 1}
                    </span>
                    {tasks.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`name-${task.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Name
                      </Label>
                      <Input
                        id={`name-${task.id}`}
                        placeholder="e.g., Motor"
                        value={task.componentName}
                        onChange={(e) =>
                          updateTask(task.id, "componentName", e.target.value)
                        }
                        className="h-9 text-sm rounded-lg bg-card border-border"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`interval-${task.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Interval (days)
                      </Label>
                      <Input
                        id={`interval-${task.id}`}
                        type="number"
                        min={1}
                        placeholder="30"
                        value={task.resetIntervalDays}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "resetIntervalDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="h-9 text-sm rounded-lg bg-card border-border"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`alert-${task.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Alert (days)
                      </Label>
                      <Input
                        id={`alert-${task.id}`}
                        type="number"
                        min={1}
                        placeholder="5"
                        value={task.alertThresholdDays}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            "alertThresholdDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="h-9 text-sm rounded-lg bg-card border-border"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tasks.length < 5 && (
              <Button
                variant="outline"
                onClick={addTask}
                className="w-full h-11 rounded-xl border-dashed border-border hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !equipmentName.trim() || !tasks.some((t) => t.componentName.trim())
            }
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Equipment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
