import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useTable, useSortBy } from 'react-table';
import '../CssForPages/TablePage.css';

export const TablePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentFileData, setCurrentFileData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState({});
  const [searchVisibility, setSearchVisibility] = useState({});

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list_files');
      setFileList(response.data);
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload_csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("There was an error uploading the file.");
    }
  };

  const handleFileClick = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_data/${fileName}`, {
        responseType: 'text'
      });
      const csvData = response.data;

      // Parse the CSV data
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log("Parsed CSV Result:", result); // Log parsed CSV result

          const data = result.data;
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const cols = Object.keys(data[0]).map(key => ({
              Header: key,
              accessor: key,
              sortType: (rowA, rowB) => {
                const a = rowA.values[key];
                const b = rowB.values[key];

                if (a == null || b == null) return a == null ? -1 : 1;

                const numA = parseFloat(a);
                const numB = parseFloat(b);
                const isNumber = !isNaN(numA) && !isNaN(numB);

                if (isNumber) {
                  return numA - numB;
                }

                return String(a).localeCompare(String(b));
              },
              Cell: ({ value }) => {
                if (value == null || (typeof value === 'number' && isNaN(value)) || value === "") {
                  return 'N/A';
                }
                return value;
              },
              isSearchVisible: searchVisibility[key] || false,
              toggleSearchVisibility: () => toggleSearchVisibility(key),
              setFilter: (value) => setSearchTerm(prev => ({ ...prev, [key]: value })),
            }));

            setColumns(cols);
            setCurrentFileData(data);
          } else {
            console.error("Data is empty or invalid.");
            setCurrentFileData([]);
            setColumns([]);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV data:", error);
          setCurrentFileData([]);
          setColumns([]);
        }
      });
    } catch (error) {
      console.error("Error fetching file data:", error);
      setCurrentFileData([]);
      setColumns([]);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:5000/delete_file/${fileName}`);
      fetchFiles(); // Refresh file list after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const toggleSearchVisibility = (columnId) => {
    setSearchVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const parseSearchTerm = (term) => {
    const trimmedTerm = term.trim();
    if (/^>\s*\d+(\.\d+)?$/.test(trimmedTerm)) {
      return { type: 'greater', value: parseFloat(trimmedTerm.slice(1).trim()) };
    } else if (/^<\s*\d+(\.\d+)?$/.test(trimmedTerm)) {
      return { type: 'lesser', value: parseFloat(trimmedTerm.slice(1).trim()) };
    }
    return { type: 'text', value: trimmedTerm.toLowerCase() };
  };

  const filteredData = useMemo(() => {
    return currentFileData.filter(row =>
      Object.keys(searchTerm).every(columnId => {
        const search = parseSearchTerm(searchTerm[columnId]);
        const rowValue = row[columnId];

        if (!searchTerm[columnId]) return true;

        if (search.type === 'greater' && !isNaN(rowValue)) {
          return parseFloat(rowValue) > search.value;
        } else if (search.type === 'lesser' && !isNaN(rowValue)) {
          return parseFloat(rowValue) < search.value;
        } else {
          return String(rowValue).toLowerCase().includes(search.value);
        }
      })
    );
  }, [searchTerm, currentFileData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredData,
    },
    useSortBy
  );

  return (
    <div className="table-container">
      <h1>Upload and Manage CSV Files</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <h2>Available Files</h2>
      <ul>
        {fileList.map((fileName) => (
          <li key={fileName}>
            <button onClick={() => handleFileClick(fileName)}>{fileName}</button>
            <button onClick={() => handleDelete(fileName)}>Delete</button>
          </li>
        ))}
      </ul>
      {currentFileData.length > 0 && (
        <div>
          <h2>File Content</h2>
          <div className="table-wrapper">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th key={column.id} {...column.getHeaderProps()}>
                        <div className="header-content">
                          <span {...column.getSortByToggleProps()} className="header-title">
                            {column.render('Header')}
                          </span>
                          <button
                            className="sort-button"
                            onClick={() => column.toggleSortBy(!column.isSortedDesc)}
                          >
                            {column.isSorted
                              ? column.isSortedDesc
                                ? '🔽'
                                : '🔼'
                              : '↕️'}
                          </button>
                          <button
                            className="search-button"
                            onClick={() => toggleSearchVisibility(column.id)}
                          >
                            🔍
                          </button>
                        </div>
                        {searchVisibility[column.id] && (
                          <input
                            type="text"
                            className="column-search"
                            placeholder={`Search ${column.Header}`}
                            onChange={(e) => column.setFilter(e.target.value)}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
