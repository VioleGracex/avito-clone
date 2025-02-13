export interface User {
    id: number;
    username: string;
    email: string;
    password: string; // In a real application, ensure to handle passwords securely
    adIds: number[]; // Array of ad IDs associated with the user
    createdAt: Date;
    updatedAt: Date;
  }