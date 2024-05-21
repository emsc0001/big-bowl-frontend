import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../settings';
import "./OrderEquipmentModal.css";

interface OrderEquipmentModalProps {
  onClose: () => void;
  addNewEquipment: (newEquipment: Equipment) => void;
}

interface Equipment {
  id: number | null;
  name: string;
  type: string;
  status: string;
  quantity: 1,
}

function OrderEquipmentModal({ onClose, addNewEquipment }: OrderEquipmentModalProps) {
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentQuantity, setEquipmentQuantity] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newEquipmentOrder = {
      name: equipmentName,
      quantity: equipmentQuantity,
    };
  
    try {
      const response = await axios.post(`${API_URL}/equipment_orders`, newEquipmentOrder);
      const newEquipment = response.data;
      console.log('New equipment data from server:', newEquipment); // Add this line
  
      addNewEquipment(newEquipment);
      onClose();
    } catch (error) {
      console.error('Error ordering equipment:', error);
    }
  };
  

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <form onSubmit={handleSubmit}>
        <label>
          Equipment Name:
          <input type="text" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} />
        </label>
        <label>
          Quantity:
          <input type="number" value={equipmentQuantity} onChange={(e) => setEquipmentQuantity(e.target.value)} />
        </label>
        <input type="submit" value="Order Equipment" />
      </form>
    </div>
  );
}

export default OrderEquipmentModal;
