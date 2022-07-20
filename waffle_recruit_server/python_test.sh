sudo docker create -it --network none --name $1 whizkyu/recruit:1.1 > /dev/null
sudo docker start $1 > /dev/null
sudo docker exec $1 mkdir -p /home/$2
sudo docker cp $2/solve.py $1:/home/$2
sudo docker cp $3/check.py $1:/home/$2
sudo docker cp $3/testcases $1:/home/$2
sudo docker cp $3/solutions $1:/home/$2
sudo docker exec $1 python3 /home/$2/check.py
sudo docker kill $1 > /dev/null
sudo docker rm $1 > /dev/null