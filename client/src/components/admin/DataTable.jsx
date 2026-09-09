import './DataTable.css';

// columns: [{ key, label, render?(row) }]
const DataTable = ({ columns, rows, rowKey = '_id' }) => (
  <div className="data-table-wrap">
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c) => <th key={c.key}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
