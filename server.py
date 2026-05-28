import http.server
import socketserver
import os
import sys

PORT = 5500

class SPAServer(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Si la ruta no existe físicamente, sirve el index.html (soporte SPA)
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = 'index.html'
        return super().do_GET()

if __name__ == "__main__":
    # Cambiar al directorio del script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), SPAServer) as httpd:
        print(f"🚀 Servidor MKS iniciado en: http://localhost:{PORT}")
        print(f"🌐 Acceso en red local: http://{http.server.socket.gethostbyname(http.server.socket.gethostname())}:{PORT}")
        httpd.serve_forever()