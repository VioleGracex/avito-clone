import React from 'react';

const ContactPanel: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 mx-au">
      <h2 className="text-2xl font-bold mb-4">Контактная информация</h2>
      <p className="text-lg mb-2">Имя: Иван Иванов</p>
      <p className="text-lg mb-2">Телефон: +7 (999) 999-99-99</p>
      <p className="text-lg mb-2">Email: example@example.com</p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full">Связаться</button>
    </div>
  );
};

export default ContactPanel;