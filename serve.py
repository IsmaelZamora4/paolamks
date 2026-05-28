import http.server
import socketserver
import urllib.parse
import os
import sys

PORT = 5500
DIRECTORY = "."

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parseamos la URL solicitada sin el query string
            parsed_path = urllib.parse.urlparse(self.path)
            rel_path = parsed_path.path.rstrip('/').lstrip('/')
            
            # Si es raíz o está vacío, sirve index.html
            if not rel_path:
                self.path = '/index.html'
            # Si tiene extensión o es un recurso (contiene punto), déjalo pasar
            elif '.' in os.path.basename(rel_path):
                pass
            # Si es una ruta del dashboard, sirve dashboard.html
            elif rel_path.startswith('dashboard'):
                self.path = '/dashboard.html'
            # Si es una ruta SPA sin extensión, intenta mapear a HTML
            else:
                html_file = os.path.join(self.directory, rel_path + ".html")
                if os.path.exists(html_file):
                    self.path = '/' + rel_path + '.html'
                else:
                    # Fallback a index.html para rutas SPA
                    self.path = '/index.html'

            # Llamamos al handler original
            return super().do_GET()
        except Exception as e:
            print(f"Error al servir {self.path}: {e}")
            self.path = '/index.html'
            return super().do_GET()

    # Para evitar caché agresivo durante el desarrollo local
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

Handler = SPARequestHandler

# Asegurar extensiones MIME correctas
if not Handler.extensions_map.get(".js"):
    Handler.extensions_map.update({
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".json": "application/json",
        ".svg": "image/svg+xml"
    })

try:
    # Asegurar que el directorio de trabajo es el mismo del script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Servidor SPA iniciado en http://localhost:{PORT}")
        print("📍 Acceso local a:")
        print(f"   - http://localhost:{PORT}/")
        print(f"   - http://localhost:{PORT}/login")
        print(f"   - http://localhost:{PORT}/register")
        print(f"   - http://localhost:{PORT}/dashboard")
        print("🛑 Presiona Ctrl+C para detener.")
        httpd.serve_forever()
except OSError as e:
    if e.errno == 10048:
        print(f"❌ Error: El puerto {PORT} ya está en uso.")
        print("   Soluciones:")
        print("   1. Cierra Live Server o VS Code")
        print("   2. Abre PowerShell como administrador y ejecuta:")
        print(f"   3. netstat -ano | findstr :{PORT}")
        print(f"   4. taskkill /PID <PID> /F")
        sys.exit(1)
    else:
        raise
