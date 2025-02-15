#!/bin/sh

if [ -z "$1" ]; then
echo "Error: No code provided."
exit 1
fi

cat <<EOF > code.c
$1
EOF


gcc code.c -o output
if [ $? -ne 0 ]; then
echo "Compilation failed."
exit 1
fi

./output



