# Utiliser une image de base Python
FROM python:3.9

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers requis dans le conteneur
COPY requirements.txt .
COPY main.py .
COPY static static
COPY templates templates
COPY schema.sql .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port sur lequel l'application Flask va écouter
EXPOSE 80
EXPOSE 443

# Commande à exécuter lorsqu'un conteneur est lancé
# Attention : n'est pas prévu pour la mise en production
CMD ["python", "main.py"]
