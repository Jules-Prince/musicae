#!/bin/bash

# Vérifier si l'argument est fourni
if [ $# -eq 0 ]; then
  echo "Veuillez fournir le chemin vers le fichier *.music en argument."
  exit 1
fi

inputFilePath="scenarios/"$1
outputDir="generated"

# Générer le fichier JavaScript
./bin/cli.js generate "$inputFilePath"

if [ $? -ne 0 ]; then
  echo "Erreur lors de la génération"
  exit 1
fi

# Exécuter le fichier JavaScript généré
generatedFilePath="$outputDir/test3.js"
node "$generatedFilePath"

if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution"
  exit 1
fi

exit 0
