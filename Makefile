datetime			:= $(shell date +"%Y-%m-%d-%H-%M")
date					:= $(shell date +"%Y-%m-%d")

local_path		:= $(PWD)

FONT_ASSETS_DIR      ?= ./src/css/fontello
FONT_PUBLIC_DIR      ?= ./public/fonts/fontello
FONTELLO_HOST ?= https://fontello.com

.PHONY: help
help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "} {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: icon-open
icon-open:
	@if test ! `which curl` ; then \
		echo 'Install curl first.' >&2 ; \
		exit 128 ; \
		fi
	curl --silent --show-error --fail --output .fontello \
		--form "config=@${FONT_ASSETS_DIR}/config.json" \
		${FONTELLO_HOST}
	firefox-developer-edition ${FONTELLO_HOST}/`cat .fontello`

.PHONY: icon-save
icon-save:
	@if test ! `which unzip` ; then \
		echo 'Install unzip first.' >&2 ; \
		exit 128 ; \
		fi
	@if test ! -e .fontello ; then \
		echo 'Run `make fontopen` first.' >&2 ; \
		exit 128 ; \
		fi
	rm -rf .fontello.src .fontello.zip
	curl --silent --show-error --fail --output .fontello.zip \
		${FONTELLO_HOST}/`cat .fontello`/get
	unzip .fontello.zip -d .fontello.src

	rm -rf ${FONT_ASSETS_DIR}
	mkdir -p ${FONT_ASSETS_DIR}
	rm -rf ${FONT_PUBLIC_DIR}
	mv `find ./.fontello.src -maxdepth 1 -name 'fontello-*'` ./.fontello.src/fontello
	
	mv ./.fontello.src/fontello/css/fontello.css ${FONT_ASSETS_DIR}/
	mv ./.fontello.src/fontello/config.json ${FONT_ASSETS_DIR}/
	mv ./.fontello.src/fontello/font ${FONT_PUBLIC_DIR}
	sed -i 's/\.\.\/font/fonts\/fontello/g' ${FONT_ASSETS_DIR}/fontello.css
	sed -i '/speak: never/d' ${FONT_ASSETS_DIR}/fontello.css
	sed -i "s/font-family: 'fontello'/font-family: 'fontello-mfm'/g" ${FONT_ASSETS_DIR}/fontello.css
	sed -i 's/font-family: "fontello"/font-family: "fontello-mfm"/g' ${FONT_ASSETS_DIR}/fontello.css
	rm -rf .fontello.src .fontello.zip

# le fichier ~/.fontello peut être supprimé manuellement lorsqu'on sait qu'on va plus avoir besoin de fontello dans la journée.

.PHONY: icon-order
icon-order: ## organise le code des glyphs pour qu'ils soient regroupés dans une plage.
	node ${PWD}/scripts/order-fontello-codes.js
