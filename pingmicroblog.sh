#!/bin/bash
curl -X "POST" "https://micro.blog/ping" \
     -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
     --data-urlencode "url=https://www.iamsim.me/feed.json"
