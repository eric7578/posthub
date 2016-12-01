THRIFT_DIR = $(CURDIR)/thrift

.PHONY: clean thrift

clean:
	cd $(THRIFT_DIR) && \
	ls | grep -v thrift_fix.js | xargs rm

$(THRIFT_DIR): clean
	mkdir -p $(THRIFT_DIR)

thrift: $(THRIFT_DIR)
	docker run --rm -v "$(THRIFT_DIR):/gen-nodejs" swarm-thrift bash /thrift/bootstrap/node && \
	node ./thrift/thrift_fix.js
