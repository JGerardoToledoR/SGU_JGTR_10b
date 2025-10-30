import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    numeroTelefono: "",
  });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = "http://localhost:8081/api/usuarios";

  // Obtener lista de usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejar cambios de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombreCompleto ||
      !formData.correoElectronico ||
      !formData.numeroTelefono
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const method = editando ? "PUT" : "POST";
      const url = editando ? `${API_URL}/${idEditando}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editando ? "Usuario actualizado ✅" : "Usuario creado ✅");
        setFormData({
          nombreCompleto: "",
          correoElectronico: "",
          numeroTelefono: "",
        });
        setEditando(false);
        setIdEditando(null);
        setShowModal(false);
        fetchUsuarios();
      } else {
        alert("Error al guardar usuario ❌");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Seguro que deseas eliminar a "${nombre}"?`)) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      alert("Usuario eliminado ✅");
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setFormData({
      nombreCompleto: usuario.nombreCompleto,
      correoElectronico: usuario.correoElectronico,
      numeroTelefono: usuario.numeroTelefono,
    });
    setEditando(true);
    setIdEditando(usuario.id);
    setShowModal(true);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setFormData({
      nombreCompleto: "",
      correoElectronico: "",
      numeroTelefono: "",
    });
    setEditando(false);
    setIdEditando(null);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      {/* Columna izquierda: formulario */}
      <div className="form-section">
        <h2>{editando ? "Editar Usuario" : "Registrar Usuario"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre Completo</label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />

          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
            required
          />

          <label>Número de Teléfono</label>
          <input
            type="tel"
            name="numeroTelefono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editando ? "Actualizar Usuario" : "Registrar"}
          </button>

          {editando && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Columna derecha: lista */}
      <div className="list-section">
        <h2>Usuarios Registrados</h2>
        {usuarios.length === 0 ? (
          <p className="empty">No hay usuarios registrados aún.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombreCompleto}</td>
                    <td>{u.correoElectronico}</td>
                    <td>{u.numeroTelefono}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(u.id, u.nombreCompleto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal (mismo formulario pero centrado) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Usuario</h3>
            <form onSubmit={handleSubmit}>
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
              />
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                required
              />
              <label>Número de Teléfono</label>
              <input
                type="tel"
                name="numeroTelefono"
                value={formData.numeroTelefono}
                onChange={handleChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
