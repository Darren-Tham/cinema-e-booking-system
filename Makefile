setup:
	docker compose -f "docker-compose.yml" up -d --build
	pip3 install mysql-connector-python
	pip3 install pandas
	python3 src/data/initializer.py
stop:
	docker compose down
start:
	docker compose start

re:
	docker compose restart
clean:
	docker stop $$(docker ps -a -q)
	docker system prune -a --volumes