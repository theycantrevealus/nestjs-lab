response=$(curl -s -w "%{http_code}" http://localhost:3000 -H "Content-Type: application/json" -d '{"msisdn": "6285261510202","xyz": "TEREINJECT"}')
body="${response%???}"
code="${response: -3}"

echo "HTTP Status Code: $code"
echo "Response Body: $body"
