import { getTenantContext } from "@/lib/tenantDb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import TagManager from "./TagManager"

export default async function ContractorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const { Contractor, Tag } = await getTenantContext()
  
  let query: any = {}
  if (q) {
    query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { tags: { $in: [q] } }
      ]
    }
  }

  const contractors = await Contractor.find(query).lean()
  const allTags = await Tag.find().lean()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Contractors</h2>
      </div>

      <div className="flex items-center space-x-2">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            name="q"
            type="search"
            placeholder="Search by name, country, or tag..."
            className="pl-8"
            defaultValue={q || ""}
          />
        </form>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No contractors found.
                </TableCell>
              </TableRow>
            ) : (
              contractors.map((contractor: any) => (
                <TableRow key={contractor._id.toString()}>
                  <TableCell className="font-medium">
                    <div>{contractor.name}</div>
                    <div className="text-sm text-gray-500">{contractor.email}</div>
                  </TableCell>
                  <TableCell>{contractor.job_title || "-"}</TableCell>
                  <TableCell>{contractor.country || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contractor.tags?.map((tag: string) => {
                        const tagData = allTags.find((t: any) => t.name === tag)
                        return (
                          <Badge key={tag} variant="secondary" style={{ backgroundColor: tagData?.color || '#e2e8f0' }}>
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TagManager 
                      contractorId={contractor._id.toString()} 
                      currentTags={contractor.tags || []} 
                      availableTags={allTags.map((t: any) => ({ id: t._id.toString(), name: t.name, color: t.color }))}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
