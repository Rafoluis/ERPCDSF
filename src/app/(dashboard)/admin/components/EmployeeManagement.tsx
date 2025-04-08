'use client'

import { Suspense, useState } from 'react'
import EmployeesTable from './EmployeesTable'
import EmployeeFormModal from './EmployeeFormModal'
import { Employee } from '@/schemas/employee.schema'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import EmployeeDelFormModal from './EmployeeDelFormModal'
import { Plus } from 'lucide-react'
import TableSearch from '@/components/tableSearch'
import Loader from '@/components/Loader'

interface Props {
  getAllEmployees: Promise<{ data: Employee[]; total: number }>
  columns: { id: string; label: string }[]
}

const EmployeeManagement = ({ columns, getAllEmployees }: Props) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit' | 'delete' | null
    selectedEmployee: Employee | null
  }>({
    isOpen: false,
    mode: null,
    selectedEmployee: null,
  })

  const handleOpenModal = (
    mode: 'create' | 'edit' | 'delete',
    employee: Employee | null = null
  ) => {
    setModalState({ isOpen: true, mode, selectedEmployee: employee })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: null, selectedEmployee: null })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block text-ls font-semibold">Empleados</h2>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button
              className="px-4 py-2 flex items-center justify-center rounded-full bg-backbuttondefault"
              onClick={() => handleOpenModal('create')}
            >
              <Plus size={20} color="white" />
              <span className="ml-2 text-sm font-medium text-textdefault">
                Agregar
              </span>
            </button>
          </div>
        </div>
      </div>


      <ErrorBoundary fallback={<div>Ha ocurrido un error</div>}>
        <Suspense fallback={<Loader />}>
          <EmployeesTable
            columns={columns}
            getAllEmployees={getAllEmployees}
            onEditEmployee={(employee) => handleOpenModal('edit', employee)}
            onDeleteEmployee={(employee) => handleOpenModal('delete', employee)}
          />
        </Suspense>
      </ErrorBoundary>

      {modalState.isOpen &&
        (modalState.mode === 'create' || modalState.mode === 'edit') && (
          <EmployeeFormModal
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
            employee={
              modalState.mode === 'edit' ? modalState.selectedEmployee : null
            }
          />
        )}

      {modalState.isOpen &&
        modalState.mode === 'delete' &&
        modalState.selectedEmployee && (
          <EmployeeDelFormModal
            employee={modalState.selectedEmployee}
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
          />
        )}
    </>
  )
}

export default EmployeeManagement
