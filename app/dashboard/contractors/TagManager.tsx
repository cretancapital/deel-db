"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { addTagToContractor, removeTagFromContractor, createTag } from "@/app/actions/tags"
import { Plus, X } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
}

export default function TagManager({ 
  contractorId, 
  currentTags, 
  availableTags 
}: { 
  contractorId: string
  currentTags: string[]
  availableTags: Tag[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleAddTag = async (tagName: string) => {
    setIsPending(true)
    await addTagToContractor(contractorId, tagName)
    setIsPending(false)
  }

  const handleRemoveTag = async (tagName: string) => {
    setIsPending(true)
    await removeTagFromContractor(contractorId, tagName)
    setIsPending(false)
  }

  const handleCreateAndAddTag = async () => {
    if (!search) return
    setIsPending(true)
    const res = await createTag(search)
    if (res.success) {
      await addTagToContractor(contractorId, search)
      setSearch("")
    }
    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Manage Tags</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            {currentTags.map(tag => {
              const tagData = availableTags.find(t => t.name === tag)
              return (
                <Badge key={tag} variant="secondary" style={{ backgroundColor: tagData?.color || '#e2e8f0' }} className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} disabled={isPending} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>

          <Command className="border rounded-md">
            <CommandInput placeholder="Search or create tags..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleCreateAndAddTag} disabled={isPending || !search}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{search}"
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {availableTags.filter(t => !currentTags.includes(t.name)).map(tag => (
                  <CommandItem key={tag.id} onSelect={() => handleAddTag(tag.name)} disabled={isPending}>
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}
