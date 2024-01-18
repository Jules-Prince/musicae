#!/bin/bash

echo "Vérifier si l'argument est fourni"
if [ $# -eq 0 ]; then
  echo "Veuillez fournir le chemin vers le fichier *.music en argument."
  exit 1
fi

isPlayable=false

while getopts ":p" opt; do
  case $opt in
    p)
      isPlayable=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

shift $((OPTIND-1))

inputFilePath="scenarios/$1.music"
outputDir="generated"

echo "Générer le fichier Python"
if $isPlayable;
then
  node ./bin/cli.js generate "$inputFilePath" -p
else
  node ./bin/cli.js generate "$inputFilePath"
fi

if [ $? -ne 0 ]; 
then
  echo "Erreur lors de la génération"
  exit 1
fi

echo "Exécuter le fichier Python généré"
generatedFilePath="$outputDir/$1.py"
python "$generatedFilePath"

if [ $? -ne 0 ]; then
  echo "Erreur lors de l'exécution"
  exit 1
fi

exit 0
