OUT_DIR = $(CURDIR)/lib
IMG_TAG = projecthub

.PHONY: image node

image:
	docker build -t $(IMG_TAG) .

$(OUT_DIR):
	mkdir $(OUT_DIR)

node: $(OUT_DIR)
	docker run --rm -v "$(OUT_DIR):/gen-nodejs" $(IMG_TAG) thrift -r --gen js:node /thrift/entry.thrift
	node bootstrap.js
