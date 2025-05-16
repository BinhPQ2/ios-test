# Webshare Vite

Webshare Vite is a file-sharing application built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com). It provides a secure and user-friendly interface for uploading, sharing, and managing files with end-to-end encryption.

## Getting Started

### Installation

To get started, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd webshare-vite
npm install
```

### Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Project Structure

The project follows a modular structure with components organized in the components directory. Here's an overview of the key files and directories:

- **`src/App.jsx`**: The main application component that manages the layout and routing between the upload and result panels.
- **`src/components/InfoPanel.jsx`**: Displays the informational panel on the left side of the application.
- **`src/components/UploadPanel.jsx`**: Handles file uploads and drag-and-drop functionality.
- **ResultPanel**: Contains components for managing and sharing uploaded files, including:
  - **`FileList.jsx`**: Displays the list of uploaded files.
  - **`AccessCode.jsx`**: Manages access codes for secure sharing.
  - **`ExpirationDate.jsx`**: Allows users to set expiration dates for shared links.
  - **`Message.jsx`**: Lets users add a custom message to their shared files.
  - **`Download.jsx`**: Displays the download link and copy functionality.
  - **`Notification.jsx`**: Shows notifications for user actions.
- **`src/components/utils.jsx`**: Contains utility functions for file handling, formatting, and UI interactions.

## Environment Variables

This project does not currently require environment variables. However, you can extend it to include environment-specific configurations as needed.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
