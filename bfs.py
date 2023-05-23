from collections import deque

def bfs(graph, start, target):
    visited = set()
    queue = deque([(start, [])])

    while queue:
        node, path = queue.popleft()
        if node == target:
            return path + [node]
        if node not in visited:
            visited.add(node)
            if node in graph:
                for neighbor in graph[node]:
                    queue.append((neighbor, path + [node]))
    
    return None

# Construir el grafo a partir de los datos
graph = {
    "Uriel Mendoza": ["Ana Martínez", "Francisco González", "Sergio Torres"],
    "José Pérez": ["Uriel Mendoza", "María Rodríguez", "Laura Ramírez"],
    "María Rodríguez": ["Carlos García", "Patricia López", "Laura Ramírez", "Sergio Torres", "Francisco González", "Juan Hernández", "Uriel Mendoza", "Ana Martínez"],
    "Juan Hernández": ["María Rodríguez", "Uriel Mendoza"],
    "Ana Martínez": ["María Rodríguez", "Uriel Mendoza", "Sergio Torres", "Laura Ramírez", "Carlos García", "Juan Hernández", "José Pérez", "Patricia López"],
    "Carlos García": ["Ana Martínez", "Patricia López", "Juan Hernández", "María Rodríguez", "José Pérez", "Laura Ramírez"],
    "Patricia López": ["Juan Hernández", "Ana Martínez", "Sergio Torres", "María Rodríguez", "Uriel Mendoza"],
    "Francisco González": ["Juan Hernández", "Ana Martínez"],
    "Laura Ramírez": ["Patricia López", "Sergio Torres", "Ana Martínez", "Juan Hernández", "María Rodríguez", "José Pérez"],
    "Sergio Torres": ["Ana Martínez", "Juan Hernández", "José Pérez"]
}

# Definir el nodo de inicio y el nodo objetivo
start_node = "María Rodríguez"
target_node = "José Pérez"

# Ejecutar el algoritmo BFS para encontrar el camino más corto
shortest_path = bfs(graph, start_node, target_node)

if shortest_path:
    print("El camino más corto desde", start_node, "hasta", target_node, "es:", shortest_path)
else:
    print("No hay camino disponible desde", start_node, "hasta", target_node)
