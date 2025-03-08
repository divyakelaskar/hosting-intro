import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/items"; // Update when deployed

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", value: "" });
  const [showInputs, setShowInputs] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", value: "" });

  useEffect(() => {
    axios.get(API_URL).then(res => setItems(res.data)).catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleCreate = () => {
    if (!showInputs) {
      setShowInputs(true);
      return;
    }
    if (!newItem.name.trim() || !newItem.value.trim()) {
      alert("Both fields are required!");
      return;
    }
    axios.post(API_URL, newItem)
      .then(res => {
        setItems([...items, res.data]);
        setNewItem({ name: "", value: "" });
        setShowInputs(false);
      })
      .catch(err => console.error("Error creating item:", err));
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setItems(items.filter(item => item.id !== id)))
      .catch(err => console.error("Error deleting item:", err));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditItem({ name: item.name, value: item.value });
  };

  const handleUpdate = () => {
    axios.put(`${API_URL}/${editId}`, editItem)
      .then(() => {
        setItems(items.map(item => (item.id === editId ? { ...item, ...editItem } : item)));
        setEditId(null);
        setEditItem({ name: "", value: "" });
      })
      .catch(err => console.error("Error updating item:", err));
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CRUD Table</h1>
      {showInputs && (
        <div className="mb-4 flex gap-2">
          <input className="border p-2 w-full" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
          <input className="border p-2 w-full" placeholder="Value" value={newItem.value} onChange={e => setNewItem({ ...newItem, value: e.target.value })} />
          <button className="bg-green-500 text-white px-4 py-2" onClick={handleCreate}>Save</button>
        </div>
      )}
      {!showInputs && (
        <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={() => setShowInputs(true)}>Create</button>
      )}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Value</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, name, value }) => (
            <tr key={id} className="border">
              <td className="p-2">
                {editId === id ? (
                  <input className="border p-1" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
                ) : (
                  name
                )}
              </td>
              <td className="p-2">
                {editId === id ? (
                  <input className="border p-1" value={editItem.value} onChange={e => setEditItem({ ...editItem, value: e.target.value })} />
                ) : (
                  value
                )}
              </td>
              <td className="p-2">
                {editId === id ? (
                  <>
                    <button className="text-green-500 mr-2" onClick={handleUpdate}>💾</button>
                    <button className="text-gray-500" onClick={() => setEditId(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button className="text-blue-500 mr-2" onClick={() => handleEdit({ id, name, value })}>✏️</button>
                    <button className="text-red-500" onClick={() => handleDelete(id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;