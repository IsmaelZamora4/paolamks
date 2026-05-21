import http.server
import socketserver
import urllib.parse
import os
import sys

PORT = 5500
DIRECTORY = "."

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parseamos la URL solicitada
        parsed_path = urllib.parse.urlparse(self.path)
        rel_path = parsed_path.path.rstrip('/')
        
        # Mapeo de rutas sin extensión a archivos HTML
        route_map = {
            '': '/index.html',
            '/': '/index.html',
            '/login': '/login.html',
            '/register': '/register.html'
        }
        
        # Si es una ruta del dashboard
        if rel_path.startswith('/dashboard'):
            self.path = '/dashboard.html'
        # Si es una de las rutas mapeadas
        elif rel_path in route_map:
            self.path = route_map[rel_path]
        # Si no existe el archivo solicitado y no tiene punto, intenta agregar .html
        elif not os.path.exists(self.translate_path(self.path)) and '.' not in os.path.basename(rel_path):
            candidate = rel_path + ".html"
            if os.path.exists(self.translate_path(candidate)):
                self.path = candidate
            else:
                self.path = '/dashboard.html'   # fallback SPA

        # Llamamos al handler original que ahora verá self.path modificado
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
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Servidor local SPA iniciado en http://localhost:{PORT}")
        print("🚀 Soporte SPA activado (Emulando Vercel rewrites)")
        print("🛑 Presiona Ctrl+C para detener.")
        httpd.serve_forever()
except OSError as e:
    if e.errno == 10048:
        print(f"❌ Error: El puerto {PORT} ya está en uso. Cierra Live Server u otro programa que lo esté usando.")
        sys.exit(1)
    else:
        raise
