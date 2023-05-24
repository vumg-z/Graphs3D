import json
import random
from faker import Faker

# Generador de nombres falsos
fake = Faker()

# Crea un conjunto de personas únicas
people = set(fake.name() for _ in range(100))

data = []
for person in people:
    # Asegura que cada persona tenga al menos un seguidor
    num_followers = random.randint(1, 20)
    followers = random.sample(people - {person}, num_followers)
    data.append({"id": person, "followers": followers})

# Almacena los datos en un archivo JSON
with open('personas3.json', 'w') as f:
    json.dump(data, f)
