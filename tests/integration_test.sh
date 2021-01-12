cd ..
docker build -t clustergrammer-test -f tests/Dockerfile .
MONGO_PSWD=$RANDOM
# docker network create clustergrammer_test_network
echo $MONGO_PSWD
docker run -d --network clustergrammer_test_network --name clustergrammer_test_mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e "MONGO_INITDB_ROOT_PASSWORD=${MONGO_PSWD}" mongo
echo "MONGODB=mongodb://admin:${MONGO_PSWD}@clustergrammer_test_mongodb:27017/"
docker run --rm -p 80:80 --env "MONGODB=mongodb://admin:${MONGO_PSWD}@clustergrammer_test_mongodb:27017/" --env "ORIGIN=http://localhost/" --env "ENTRY_POINT=/clustergrammer" \
    --env "HARMONIZOME_URL=https://amp.pharm.mssm.edu/Harmonizome" --env "ENRICHR_URL=https://amp.pharm.mssm.edu/Enrichr" \
    --env "L1000CDS2_URL=https://amp.pharm.mssm.edu/l1000cds2" --env "GEN3VA_URL=https://amp.pharm.mssm.edu/gen3va" \
   --network "clustergrammer_test_network" clustergrammer-test
