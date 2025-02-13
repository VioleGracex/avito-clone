import React from 'react';

const ContactPanel: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Контактная информация</h2>
      <p>Имя контактного лица</p>
      <p>Телефон: +7 123 456 7890</p>
      <p>Email: example@example.com</p>
    </div>
  );
};

export default ContactPanel;