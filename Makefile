install: node_modules

node_modules: package.json
		npm install -g

default: install
