import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'

export default function DataTable({
  columns,
  rows = [],
  getRowKey = (row) => row.id,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  caption,
  className = '',
}) {
  const visibleColumns = columns.filter((column) => !column.hidden)

  if (loading) return <LoadingState label="Loading records" />
  if (error) {
    return (
      <ErrorState
        message={typeof error === 'string' ? error : error.message}
        onRetry={onRetry}
      />
    )
  }
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={`ui-table-scroll ${className}`.trim()}>
      <table className="ui-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.align ? `align-${column.align}` : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)}>
              {visibleColumns.map((column) => (
                <td
                  key={column.key}
                  className={column.align ? `align-${column.align}` : undefined}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : (row[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}