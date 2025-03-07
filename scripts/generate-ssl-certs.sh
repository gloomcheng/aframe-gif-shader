#!/bin/sh
# Generate self-signed SSL certificates for development
# This script is used by the "npm run dev" command

CERT_DIR="certs"
KEY_FILE="$CERT_DIR/key.pem"
CERT_FILE="$CERT_DIR/cert.pem"

# Check if certificates already exist
if [ -f "$KEY_FILE" ] && [ -f "$CERT_FILE" ]; then
  echo "SSL certificates already exist in $CERT_DIR."
  exit 0
fi

# Create certificate directory if it doesn't exist
mkdir -p "$CERT_DIR"

echo "Generating self-signed SSL certificates for development..."

# Generate a self-signed SSL certificate
openssl req -x509 -newkey rsa:2048 -keyout "$KEY_FILE" -out "$CERT_FILE" -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

# Check if generation was successful
if [ $? -eq 0 ]; then
  echo "SSL certificates successfully generated in $CERT_DIR."
  chmod 600 "$KEY_FILE" "$CERT_FILE"
else
  echo "Failed to generate SSL certificates."
  exit 1
fi

exit 0 