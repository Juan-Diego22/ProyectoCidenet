import re

def generar_correo_base(nombre: str, apellido: str, pais: str) -> str:
    # Regla: Minúsculas y quitar espacios en apellidos compuestos 
    nombre_limpio = nombre.lower().strip()
    apellido_limpio = apellido.lower().replace(" ", "")
    
    # Regla: Dominio según país [cite: 20]
    dominio = "cidenet.com.co" if pais == "Colombia" else "cidenet.com.us"
    
    return f"{nombre_limpio}.{apellido_limpio}@{dominio}"

def obtener_correo_unico(nombre: str, apellido: str, pais: str, correos_existentes: list) -> str:
    correo_base = generar_correo_base(nombre, apellido, pais)
    
    # Si no existe, se retorna [cite: 21]
    if correo_base not in correos_existentes:
        return correo_base
    
    # Si existe, agregar ID secuencial [cite: 21-23]
    prefijo, dominio = correo_base.split("@")
    contador = 1
    while True:
        nuevo_correo = f"{prefijo}.{contador}@{dominio}"
        if nuevo_correo not in correos_existentes:
            return nuevo_correo
        contador += 1