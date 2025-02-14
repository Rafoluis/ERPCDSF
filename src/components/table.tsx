import TableColumn from "./TableColumn";

const Table = ({ columns, renderRow, data, }: {
    columns: { header: string; accessor: string; className?: string }[];
    renderRow: (item: any) => React.ReactNode;
    data: any[];
}) => {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-500 text-sm">
                    {columns.map((col) => (
                        <TableColumn
                            key={col.accessor}
                            header={col.header}
                            accessor={col.accessor}
                            className={col.className || ""}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
    );
};

export default Table;