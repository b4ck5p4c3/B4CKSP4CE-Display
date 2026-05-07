# Makefile для B4CKSP4CE Display
# Использование: make <target>   (см. `make help`)

# ---- Конфигурация (можно переопределить: make run DATA_PATH=/tmp/data) ----
MVNW          ?= ./mvnw
JAR           ?= target/spaceDisplay.jar
DATA_PATH     ?= data
BASE_URL      ?= http://localhost:8080
SERIAL_PORT   ?=
SCRIPT_ID     ?=
PRINTER       ?= serial
JAVA          ?= java
JAVA_OPTS     ?=
WEB_DIR       ?= web-sources
NPM           ?= npm

# Аргументы для запуска jar
RUN_ARGS = --data.path=$(DATA_PATH) --server.baseUrl=$(BASE_URL) --display.printer=$(PRINTER)
ifeq ($(PRINTER),serial)
ifneq ($(strip $(SERIAL_PORT)),)
RUN_ARGS += --display.printer.serial.port=$(SERIAL_PORT)
endif
endif
ifneq ($(strip $(SCRIPT_ID)),)
RUN_ARGS += --display.default.scriptId=$(SCRIPT_ID)
endif

.DEFAULT_GOAL := help
.PHONY: help all build package backend frontend frontend-install frontend-dev \
        frontend-build run run-dev run-console run-headless run-bg stop \
        clean clean-backend clean-frontend distclean install deps detect-serial \
        version check-java check-node rebuild watch deploy-service

# ---- Справка ---------------------------------------------------------------

help: ## Показать этот список целей
	@echo "B4CKSP4CE Display — доступные цели:"
	@echo
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo
	@echo "Переменные:"
	@echo "  DATA_PATH=$(DATA_PATH)"
	@echo "  BASE_URL=$(BASE_URL)"
	@echo "  PRINTER=$(PRINTER)            (serial | console | none)"
	@echo "  SERIAL_PORT=$(SERIAL_PORT)   (пусто = автоопределение по /dev/serial/by-id/)"
	@echo "  SCRIPT_ID=$(SCRIPT_ID)       (UUID скрипта для автозапуска)"
	@echo
	@echo "Примеры:"
	@echo "  make run                                  # боевой запуск с serial-принтером"
	@echo "  make run-console                          # macOS / dev — вывод в stdout"
	@echo "  make run-headless                         # без принтера (только REST/WS)"
	@echo "  make run SERIAL_PORT=/dev/ttyUSB0"
	@echo "  make run DATA_PATH=/srv/data BASE_URL=http://192.168.1.10:8080"

# ---- Основные сценарии -----------------------------------------------------

all: build ## Полная сборка (фронт + бэк, jar в target/)

build: package ## Алиас для package

package: $(JAR) ## Собрать jar с встроенным фронтендом

$(JAR): check-java
	$(MVNW) package

rebuild: clean build ## Чистая пересборка с нуля

# ---- Backend ---------------------------------------------------------------

backend: check-java ## Собрать только backend (фронт пропущен)
	$(MVNW) package -Dexec.skip=true

# ---- Frontend --------------------------------------------------------------

frontend: frontend-build ## Алиас для frontend-build

frontend-install: check-node ## Установить npm-зависимости фронтенда
	cd $(WEB_DIR) && $(NPM) install

frontend-build: check-node ## Собрать production-бандл фронтенда
	cd $(WEB_DIR) && $(NPM) install && $(NPM) run build

frontend-dev: check-node ## Запустить дев-сервер фронтенда (http://localhost:3000)
	cd $(WEB_DIR) && $(NPM) start

# ---- Запуск ----------------------------------------------------------------

run: $(JAR) ## Запустить приложение
	$(JAVA) $(JAVA_OPTS) -jar $(JAR) $(RUN_ARGS)

run-dev: $(JAR) ## Запустить с dev-профилем
	$(JAVA) $(JAVA_OPTS) -jar $(JAR) --spring.profiles.active=dev --data.path=$(DATA_PATH)

run-console: $(JAR) ## Запустить с выводом в консоль (без serial — для macOS/dev)
	$(MAKE) --no-print-directory run PRINTER=console

run-headless: $(JAR) ## Запустить без принтера (REST/WebSocket работают, на матрицу ничего не идёт)
	$(MAKE) --no-print-directory run PRINTER=none

run-bg: $(JAR) ## Запустить в фоне (PID -> .run.pid, лог -> run.log)
	@nohup $(JAVA) $(JAVA_OPTS) -jar $(JAR) $(RUN_ARGS) > run.log 2>&1 & echo $$! > .run.pid
	@echo "Запущено, PID=$$(cat .run.pid), лог: run.log"

stop: ## Остановить фоновый процесс из run-bg
	@if [ -f .run.pid ]; then \
		kill $$(cat .run.pid) 2>/dev/null && echo "Остановлено (PID $$(cat .run.pid))" || echo "Процесс уже не работает"; \
		rm -f .run.pid; \
	else \
		echo "Нет .run.pid — процесс не запускался через run-bg"; \
	fi

# ---- Зависимости / окружение ----------------------------------------------

install: deps ## Алиас для deps

deps: frontend-install ## Установить все зависимости разработки

check-java:
	@command -v $(JAVA) >/dev/null 2>&1 || { echo "Ошибка: java не найдена в PATH"; exit 1; }
	@test -x $(MVNW) || { echo "Ошибка: $(MVNW) отсутствует или не исполняемый"; exit 1; }

check-node:
	@command -v $(NPM) >/dev/null 2>&1 || { echo "Ошибка: npm не найден в PATH"; exit 1; }

# ---- Утилиты ---------------------------------------------------------------

detect-serial: ## Показать подключённые serial-устройства
	@if [ -d /dev/serial/by-id ]; then \
		echo "Устройства в /dev/serial/by-id/:"; \
		ls -l /dev/serial/by-id/ 2>/dev/null || echo "  (пусто)"; \
	else \
		echo "/dev/serial/by-id не существует (возможно, не Linux или нет USB-serial)"; \
	fi

version: ## Версии сборочных инструментов
	@echo "java:  $$($(JAVA) -version 2>&1 | head -1)"
	@echo "maven: $$($(MVNW) -v 2>/dev/null | head -1)"
	@echo "node:  $$(node -v 2>/dev/null || echo 'не установлен')"
	@echo "npm:   $$($(NPM) -v 2>/dev/null || echo 'не установлен')"

deploy-service: ## Показать пример установки systemd-юнита из dev/
	@echo "Шаблон: dev/space-display.service"
	@echo "Установка:"
	@echo "  sudo cp dev/space-display.service /etc/systemd/system/"
	@echo "  sudo systemctl daemon-reload"
	@echo "  sudo systemctl enable --now space-display.service"

# ---- Очистка ---------------------------------------------------------------

clean: clean-backend ## Удалить артефакты сборки backend

clean-backend:
	$(MVNW) clean

clean-frontend: ## Удалить node_modules и build фронтенда
	rm -rf $(WEB_DIR)/node_modules $(WEB_DIR)/build

distclean: clean clean-frontend ## Полная очистка (включая node_modules)
	rm -f run.log .run.pid
