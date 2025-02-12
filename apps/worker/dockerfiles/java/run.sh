#!/bin/sh

if [ -z "$1" ]; then
  echo "Error: No code provided."
  exit 1
fi

cat <<EOF > Main.java
$1
EOF

javac Main.java

if [ $? -ne 0 ]; then
  echo "Compilation failed."
  exit 1
fi

java Main
