#!/bin/sh

if [ -z "$1" ]; then
  echo "Error: No code provided."
  exit 1
fi

cat <<EOF > main.py
$1
EOF

python main.py
