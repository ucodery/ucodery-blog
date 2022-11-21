dev:
	python -m nikola auto --browser

clean:
	python -m nikola check --clean-files

.PHONY: dev clean
