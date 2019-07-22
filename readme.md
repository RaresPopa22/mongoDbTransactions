Simple app in which we make use of MongoDB transactions.

Docker cmds:

docker network create mongo-replica-set

docker run -d -p 30001:27017 --name mongo1 -e MONGODB_REPLICA_SET_MODE=primary --net my-mongo-cluster mongo mongod --replSet mongo-replica-set

docker run -d -p 30002:27017 --name mongo2 -e MONGODB_REPLICA_SET_MODE=secondary -e MONGODB_PRIMARY_HOST=mongo1 --net my-mongo-cluster mongo mongod --replSet mongo-replica-set

docker run -d -p 30003:27017 --name mongo3 -e MONGODB_REPLICA_SET_MODE=secondary -e MONGODB_PRIMARY_HOST=mongo1 --net my-mongo-cluster mongo mongod --replSet mongo-replica-set

docker exec -it mongo1 mongo

config = { "_id": "mongo-replica-set", "members": [{"_id": 0, "host": "192.168.150.123:30001"},{"_id": 1,"host": "192.168.150.123:30002"},{"_id": 2,"host": "192.168.150.123:30003"	}	]}

rs.initiate(config)