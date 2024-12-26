#!/bin/bashbash

#Check if a folder name is provided
if [ -z "$1" ]; then
    echo No folder name given
    exit 1
fi

# Use the provided folder name
folder_name="$1"

# Template files
solution_file="$PWD/00/00.ts"
test_file="$PWD/00/00.test.ts"

# Create and access new folder
mkdir "$folder_name" && cd "$folder_name"

# Add relevant files
cp "$solution_file" "./$folder_name.ts"
cp "$test_file" "./$folder_name.test.ts"
touch example_a.txt example_b.txt input.txt

# Update day for templates
sed -i "/..\/00\/tools/! s/00/$folder_name/g" "$folder_name.ts" "$folder_name.test.ts"

echo "Folder '$folder_name' and files created successfully."