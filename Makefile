.PHONY: start build setup lint

start:
	medusa serve --port 1776

build:
	medusa build

setup:
	pip install medusa-ssg
	npm install

lint:
	npm run format
