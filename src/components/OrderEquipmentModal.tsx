import React, { useState } from 'react';
import axios from 'axios';

function OrderEquipmentModal({ onClose }) {
    const [equipmentName, setEquipmentName] = useState('');
    const [equipmentQuantity, setEquipmentQuantity] = useState(1);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newEquipmentOrder = {
            name: equipmentName,
            quantity: equipmentQuantity,
        };

        await axios.post('/equipment_orders', newEquipmentOrder);

        onClose(); // Close the modal after the form is submitted
    };

    return (
        <div>
            <button onClick={onClose}>Close</button> {/* New button for closing the modal */}
            <form onSubmit={handleSubmit}>
                <label>
                    Equipment Name:
                    <input type="text" value={equipmentName} onChange={e => setEquipmentName(e.target.value)} />
                </label>
                <label>
                    Quantity:
                    <input type="number" value={equipmentQuantity} onChange={e => setEquipmentQuantity(e.target.value)} />
                </label>
                <input type="submit" value="Order Equipment" />
            </form>
        </div>
    );
}

export default OrderEquipmentModal;