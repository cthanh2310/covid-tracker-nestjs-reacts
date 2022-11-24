setup: 
	@echo "==========Install dependencies================================"
	yarn install

	@echo "================================migrating DB and seed database================================"
	yarn migration

	@echo "================================export data from excel ================================================================="
	yarn export-excel