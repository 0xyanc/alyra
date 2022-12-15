L’objectif est de pouvoir identifier une adresse grâce à un smart contract.
Il est possible d’ajouter dans le constructeur l’identité du « deployer » directement (Le
propriétaire du contrat intelligent).
Une fonction « addPerson » permet de faire concorder une structure « Person » à une
adresse par le biais d’un mapping.
Une fonction getPerson permet de retourner la structure Person rattachée à une adresse.
1. Créer un projet hardhat utilisant le plugin hardhat-deploy
2. Compléter le smart contract ci-dessous (penser à ajouter les contracts de openZeppelin
au projet)
3. Créer le fichier de configuration hardhat.config.js
4. Créer le fichier .env (penser à ajouter dotenv au projet)
5. Créer le fichier « helper-hardhat-config.js ».
6. Créer le fichier «./utils/verify.js » permettant de vérifier un contrat intelligent sur
Etherscan
7. Créer le fichier de déploiement et passer les 3 arguments nécessaires au constructeur
du contrat intelligent lors du déploiement.
8. Déployer le contrat sur la blockchain local hardhat ainsi que sur Goerli.
