up:
	docker compose up -d

down:
	docker compose down

start:
	npm install
	make up
	npm run start
