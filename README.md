# Alumni-Link

## 📌 Overview
**Alumni-Link** is a platform designed to connect alumni and students, enabling networking, mentorship, and event management. It allows users to create profiles, send messages, and stay updated on alumni-related activities.

## 🚀 Features
- 🏷 **User Profiles**: Alumni can update their profiles.
- 💬 **Messaging**: Direct messaging system for networking.
  - Student ↔ Alumni
  - Mentor ↔ Alumni
- 📅 **Event Management**: Organize and participate in alumni events.
- 🔍 **Search & Filters**: Find alumni based on domain, batch, or company.
- 📜 **Posts & Updates**: Share experiences and insights.

## 🛠 Tech Stack
- **Frontend**: Angular, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication

## 🏗 Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [MongoDB](https://www.mongodb.com/)

### Clone the Repository
```bash
git clone https://github.com/jawahar63/alumni-link.git
cd alumni-link
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## 📌 Environment Variables
Create a `.env` file in the backend directory and configure the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 📜 Roles
- **Alumni**: Can update their profile.
- **Mentor**: Can create users.
- **Student**: Can view and join events, and chat.

## 📜 Usage
1. Register/Login as an alumni or student.
2. Update your profile with domain, batch, and company details.
3. Connect with alumni through direct messaging.
4. Stay updated with alumni events and news.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, create a branch, and submit a pull request.

## 📧 Contact
For any inquiries, reach out at [d.jawahar6382@gmail.com](mailto:d.jawahar6382@gmail.com).

