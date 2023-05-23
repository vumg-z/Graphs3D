import json
import random

data = []
for i in range(1, 11):
    followers = list(range(1, 11))
    followers.remove(i)
    followers = random.sample(followers, random.randint(1, 9))
    followers = ["Student" + str(f) for f in followers]
    data.append({"id": "Student" + str(i), "followers": followers})

with open('data.json', 'w') as f:
    json.dump(data, f)
