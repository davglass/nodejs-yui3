all: deps clean bare base full

full: deps
	@./scripts/make_package.sh full

bare: deps
	@./scripts/make_package.sh bare

base: deps
	@./scripts/make_package.sh base

publish: deps test
	@./scripts/publish.sh

dev: deps clean full 
	@echo "make clean && make full DONE"
	@echo "Now you can: npm install /path/to/source/yui3/build/full to install it locally"
	@echo "Or you can: npm link /path/to/source/yui3/build/full to link it into your project"

test: deps
	@./scripts/test.sh

tests: test
isntall: install

install: deps all
	@./scripts/install.sh

deps: ./scripts/deps.sh

clean:
	rm -rRf ./build/

help:
	@cat ./INSTALL

.PHONY: all install test bare base full publish clean deps test help
