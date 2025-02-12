#!/bin/sh

if [ -z "$1" ]; then
  echo "Error: No code provided."
  exit 1
fi

cat <<EOF > index.js
$1
EOF

node index.js
