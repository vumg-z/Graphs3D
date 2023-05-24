import json
import random
from faker import Faker

# Generador de nombres falsos
fake = Faker()

# Crea un conjunto de personas únicas
people = set(fake.name() for _ in range(100))

# Crea los nodos especiales
special_nodes = set(random.sample(list(people), int(len(people)*0.1))) # nodos especiales

# Divide el conjunto de personas en dos grupos
group1 = set(random.sample(list(people), len(people)//2))
group2 = people - group1

data = []
# Primero creamos todos los nodos
for person in people:
    data.append({"id": person, "followers": []})

# Ahora asignamos seguidores
for person in data:
    # Si es un nodo especial, asigna seguidores de ambos grupos
    if person['id'] in special_nodes:
        num_followers_group1 = min(random.randint(1, len(group1)), len(group1))
        num_followers_group2 = min(random.randint(1, len(group2)), len(group2))
        followers_group1 = random.sample(list(group1), num_followers_group1)
        followers_group2 = random.sample(list(group2), num_followers_group2)
        person["followers"] = followers_group1 + followers_group2
    # Si no es un nodo especial, asigna seguidores solo de su propio grupo
    else:
        current_group = group1 if person['id'] in group1 else group2
        potential_followers = list(current_group - {person['id']})
        num_followers = min(random.randint(1, len(potential_followers)), len(potential_followers))
        followers = random.sample(potential_followers, num_followers)
        person["followers"] = followers

# Almacena los datos en un archivo JSON
with open('personas3.json', 'w') as f:
    json.dump(data, f)
