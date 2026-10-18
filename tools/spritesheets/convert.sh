#!/bin/bash
if [ $# -ne 3 ]; then
    echo "Usage: $0 <image_source> <target_width> <target_height>"
    exit 1
fi
FILENAME=$(echo $1 | rev | cut -d "/" -f1 | rev | cut -d "." -f1)
echo "Splitting spritesheet..."
echo "Running command: python convert.py $1"
python convert.py $1
if [ $? -ne 0 ]; then
    echo "Detected an error. Exiting."
    exit 1
fi
echo "Output to: $0/output/$FILENAME"
echo
echo "Merging spritesheet..."
echo "Running command: python merge.py output/$FILENAME/ $2 $3"
python merge.py output/$FILENAME/ $2 $3
if [ $? -ne 0 ]; then
    echo "Detected an error. Exiting."
    exit 1
fi
echo "Done."