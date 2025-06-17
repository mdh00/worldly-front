# Worldly 🌏

Worldly is a React app that lets users explore countries, search by criteria, and save favorites. It uses the REST Countries API for data and Clerk for secure user authentication.

## 📌 Live Demo

Visit the live application at [https://worldly-map.netlify.app/](https://worldly-map.netlify.app/)

## 🌟 Features

- Browse all countries with essential information (name, population, region, flags)
- Search countries by name
- Filter countries by region and subregion
- View detailed information about a specific country
- User authentication system
- Save favorite countries with a user account
- Access favorite countries list
- Responsive design for mobile and desktop

## 🛠️ Technologies

- React (with Vite)
- REST Countries API
- Clerk Authentication
- React Router
- Axios for API requests
- Tailwind CSS for styling
- Shadcn UI component library
- Netlify for deployment

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or higher)
- npm (v6.x or higher) or yarn

## 🚀 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-mdh00.git
   cd af-2-mdh00
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Clerk public key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit `http://localhost:5173/`

## 🏗️ Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## 📋 API Integration

The application uses the following endpoints from the REST Countries API:

- `/all` - Get all countries
- `/alpha/{code}` - Get country by code
- `/name/{name}` - Search countries by name
- `/region/{region}` - Search countries by region
- `/subregion/{subregion}` - Search countries by subregion

## 🔐 Authentication

Authentication is handled through Clerk. When users sign in, they can:
- Save countries to their favorites list
- View their favorites across sessions
- User data and favorites are stored in Clerk metadata

## 💾 Session Storage

The application uses session storage to persist filter options between page reloads, improving the user experience.

## 📱 Responsive Design

The application is fully responsive and works well on:
- Desktop
- Tablets
- Mobile devices


## 🙏 Acknowledgements

- [REST Countries API](https://restcountries.com/) for providing country data
- [Clerk](https://clerk.com/) for authentication services
- [Vite](https://vitejs.dev/) for the build tool
- [React](https://reactjs.org/) for the UI library
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Shadcn UI](https://ui.shadcn.com/) for accessible component library
- [Netlify](https://www.netlify.com/) for hosting

---

Made with ❤️ by [MDH00](https://github.com/mdh00)
