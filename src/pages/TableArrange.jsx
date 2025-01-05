import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TableArrange.css';

const employees = ['Alice', 'Bob', 'Charlie', 'John', 'Emma'];

const TableArrange = () => {
  const [tables, setTables] = useState([]);
  const [draggedTable, setDraggedTable] = useState(null);
  const [combinedTables, setCombinedTables] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/table/getalltables');
      const data = await response.json();
      
      if (data.code === "00") {
        const formattedTables = data.content.map(table => ({
          id: table.id,
          number: table.number,
          seats: table.seats,
          status: table.status === 'Available' ? 'Vacant' : 'Booked',
          createdAt: table.createdAt,
          updatedAt: table.updatedAt,
          customers: 0,
          employee: '',
          bill: { orderNumber: '', amount: 0 }
        }));
        setTables(formattedTables);
      } else {
        throw new Error('Failed to fetch tables');
      }
    } catch (err) {
      setError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, table) => {
    setDraggedTable(table);
    e.dataTransfer.setData('table', table.id);
  };

  const handleDrop = (e, targetTable) => {
    e.preventDefault();
    if (!draggedTable || draggedTable.id === targetTable.id || combinedTables[targetTable.id]) return;

    const newStatus = targetTable.status === 'Booked' || draggedTable.status === 'Booked' ? 'Booked' : 'Vacant';
    const combinedId = targetTable.id;
    const combinedTable = {
      id: combinedId,
      number: targetTable.number,
      name: `TABLE ${targetTable.number} + Table ${draggedTable.number}`,
      status: newStatus,
      customers: targetTable.customers + draggedTable.customers,
      employee: `${targetTable.employee}, ${draggedTable.employee}`,
      seats: targetTable.seats + draggedTable.seats
    };

    setTables(prev => prev.filter(t => t.id !== targetTable.id && t.id !== draggedTable.id));
    setCombinedTables(prev => ({
      ...prev,
      [combinedId]: [targetTable, draggedTable],
    }));
    setTables(prev => [...prev, combinedTable]);
    setDraggedTable(null);
  };

  const handleDivide = () => {
    if (!draggedTable || !combinedTables[draggedTable.id]) return;

    const originalTables = combinedTables[draggedTable.id].map(table => ({
      ...table,
      status: table.status,
    }));

    setTables(prev => [...prev.filter(t => t.id !== draggedTable.id), ...originalTables]);
    setCombinedTables(prev => {
      const newState = { ...prev };
      delete newState[draggedTable.id];
      return newState;
    });
    setDraggedTable(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTableClick = (table) => {
    if (table.status === 'Vacant') {
      setSelectedTable(table);
      setShowPopup(true);
      setSelectedEmployee('');
      setCustomerCount('');
    } else {
      navigate('/bills', { state: { table } });
    }
  };

  const handleEditTable = (e, table) => {
    e.stopPropagation();
    setSelectedTable(table);
    setSelectedEmployee(table.employee);
    setCustomerCount(table.customers);
    setShowPopup(true);
  };

  const handleAssignEmployeeAndCustomer = () => {
    if (!selectedEmployee || customerCount === '') return;

    const updatedTable = {
      ...selectedTable,
      employee: selectedEmployee,
      customers: parseInt(customerCount),
      status: 'Booked',
    };

    setTables(prev =>
      prev.map(table => (table.id === selectedTable.id ? updatedTable : table))
    );

    setShowPopup(false);
    setSelectedTable(null);
    setSelectedEmployee('');
    setCustomerCount('');
    navigate('/food-order', { state: { table: updatedTable } });
  };

  if (loading) return <div>Loading tables...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-arrange">
      <h2>Rest POS</h2>
      <p>Tuesday, 2 Feb 2021</p>
      <h2>Table Arrangement</h2>

      <div className="tables-container">
        {tables.map(table => (
          <div
            key={table.id}
            className={`table-card ${table.status.toLowerCase()}`}
            draggable
            onDragStart={(e) => handleDragStart(e, table)}
            onDrop={(e) => handleDrop(e, table)}
            onDragOver={handleDragOver}
            onClick={() => handleTableClick(table)}
          >
            <div className="table-card-header">
              {table.status === 'Booked' && (
                <button
                  className="edit-button"
                  onClick={(e) => handleEditTable(e, table)}
                >
                  ✏️
                </button>
              )}
            </div>

            {combinedTables[table.id] ? (
              <h5>{table.name}</h5>
            ) : (
              <h5>{`Table ${table.number}`}</h5>
            )}
            
            <p>Status: {table.status}</p>
            <p>{table.customers} Customers</p>
            <p>Employee: {table.employee}</p>
            <p>Seats: {table.seats}</p>
          </div>
        ))}
      </div>

      <div className="drop-zone" onDrop={handleDivide} onDragOver={handleDragOver}>
        <p>Drop combined tables here to divide them</p>
      </div>

      {showPopup && selectedTable && selectedTable.status === 'Vacant' && (
        <div className="popup">
          <div className="popup-content">
            <h3>Assign Employee and Customers to {selectedTable.name}</h3>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee}>
                  {employee}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={customerCount}
              onChange={(e) => setCustomerCount(e.target.value)}
              placeholder="Enter customer count"
              min="0"
            />

            <div className="popup-actions">
              <button onClick={handleAssignEmployeeAndCustomer}>Assign</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPopup && selectedTable && selectedTable.status === 'Booked' && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Table {selectedTable.name}</h3>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee}>
                  {employee}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={customerCount}
              onChange={(e) => setCustomerCount(e.target.value)}
              placeholder="Enter customer count"
              min="0"
            />

            <div className="popup-actions">
              <button
                onClick={() => {
                  const updatedTable = {
                    ...selectedTable,
                    employee: selectedEmployee,
                    customers: parseInt(customerCount),
                  };

                  setTables(prev =>
                    prev.map(table => (table.id === selectedTable.id ? updatedTable : table))
                  );

                  setShowPopup(false);
                  setSelectedTable(null);
                  setSelectedEmployee('');
                  setCustomerCount('');
                }}
              >
                Save Changes
              </button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableArrange;      