import plotly.graph_objects as go
import networkx as nx

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

# Crear el grafo dirigido
G = nx.DiGraph(graph)

# Obtener las posiciones de los nodos en el plano XY
pos = nx.spring_layout(G, seed=42, scale=2)  # Ajustar el parámetro scale para aumentar el espacio entre los nodos

# Crear un objeto de figura de Plotly
fig = go.Figure()

# Agregar los nodos al gráfico
for node in G.nodes():
    x, y = pos[node]
    fig.add_trace(go.Scatter(x=[x], y=[y], mode="markers", name=node, marker=dict(size=100)))  # Ajustar el parámetro size para hacer los nodos más grandes

# Agregar las aristas al gráfico
for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    fig.add_trace(go.Scatter(x=[x0, x1], y=[y0, y1], mode="lines", line=dict(color="black")))  # Ajustar el color de la línea a negro

# Resaltar el camino más corto en rojo
shortest_path = nx.shortest_path(G, "María Rodríguez", "José Pérez")
path_edges = [(shortest_path[i], shortest_path[i + 1]) for i in range(len(shortest_path) - 1)]
for edge in path_edges:
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    fig.add_trace(go.Scatter(x=[x0, x1], y=[y0, y1], mode="lines", line=dict(color="red", width=10)))

# Configurar el diseño del gráfico
fig.update_layout(
    title="Grafo",
    showlegend=False,
    hovermode="closest",
    xaxis=dict(visible=False),
    yaxis=dict(visible=False),
    plot_bgcolor="white"
)

# Mostrar el gráfico
fig.show()
