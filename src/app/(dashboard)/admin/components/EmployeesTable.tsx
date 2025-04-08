import Pagination from '@/components/pagination'
import Table from '@/components/table/Table'
import TableAction from '@/components/table/TableAction'
import { Employee } from '@/schemas/employee.schema'
import { Pencil, Trash2 } from 'lucide-react'
import { use } from 'react'

interface Props {
  getAllEmployees: Promise<{ data: Employee[]; total: number }>
  columns: { id: string; label: string }[]
  onDeleteEmployee: (employee: Employee) => void
  onEditEmployee: (employee: Employee) => void
}

export default function EmployeesTable({
  getAllEmployees,
  columns,
  onDeleteEmployee,
  onEditEmployee,
}: Props) {
  const { data, total } = use(getAllEmployees)

  return (
    <>
      <Table
        columns={columns}
        rows={data}
        customRenderers={{
          fecha_creacion: (row) =>
            row.fecha_creacion
              ? new Date(row.fecha_creacion).toLocaleDateString()
              : '',
          nombre: (row) => (
            <div className='flex flex-col'>
              <span className='font-semibold'>
                {row.nombre.concat(' ', row.apellido)}
              </span>
              <span className='text-gray-500 text-sm'>{row.dni}</span>
            </div>
          ),
          roles: (row) => (
            <span className='lowercase'>{row.roles.join(', ')}</span>
          ),
          estado: (row) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${row.estado === 'Activo'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
                }`}
            >
              {row.estado}
            </span>
          ),
        }}
        customActions={(row) => (
          <>
            <TableAction
              icon={<Pencil />}
              onClick={() => onEditEmployee(row)}
              className="shadow-sm hover:shadow-md bg-cyan-100 hover:bg-cyan-200"
              iconColor="text-black"
              hoverIconColor="text-black"
              iconSize="w-4 h-4"
            />

            <TableAction
              icon={<Trash2 />}
              onClick={() => onDeleteEmployee(row)}
              className="shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200"
              iconColor="text-black"
              hoverIconColor="text-black"
              iconSize="w-4 h-4"
            />
          </>
        )}
      />
      <Pagination page={5} count={total} />
    </>
  )
}
