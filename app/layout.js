
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthContext';
import './globals.css';

export const metadata = {
  title: 'E-Commerce Store',
  description: 'Shop for amazing products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              {children}
            </main>
            <footer className="footer mt-auto py-3 bg-dark text-white">
              <div className="container text-center">
                <span className="text-muted">© 2023 E-Commerce Store. All rights reserved.</span>
              </div>
            </footer>
          </div>
        </AuthProvider>
        {/* Bootstrap JS Bundle */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </body>
    </html>
  );
}