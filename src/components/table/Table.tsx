import { ReactNode } from 'react'
import TableItem from './TableItem'
import TableColumn from '../TableColumn'

interface Props<T> {
  columns: ColumnHeader[]
  rows: T[]
  customRenderers?: {
    [key: string]: (row: T) => ReactNode
  }
  customActions?: (row: T) => ReactNode
}

const Table = <T,>({
  columns,
  rows,
  customRenderers = {},
  customActions,
}: Props<T>): ReactNode => {
  return (
    <table className='w-full mt-4 border-t border-gray-300'>
      <thead className="border-b border-gray-300">
        <tr className='text-left text-gray-500 text-sm'>
          {columns.map((column) => (
            <TableColumn
              key={column.id}
              header={column.label}
              className={column.className || ''}
              accessor={column.id}
            />
          ))}
          {customActions && <th className=''>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <TableItem
            key={`row-${rowIndex}`}
            row={row}
            columns={columns}
            customRenderers={customRenderers}
            customActions={customActions}
          />
        ))}
      </tbody>
    </table>
  )
}

export default Table
