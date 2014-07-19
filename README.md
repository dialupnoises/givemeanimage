# givemeanimage

Select a random image from a specified directory, and upload it to imgur. Don't know why you'd need this? You probably don't.

## Usage
```
Usage: givemeanimage <directory>

Options:
	-h, --help                   output usage information
	-V, --version                output the version number
	-f, --filter [file types]    include only files with these types, comma-seperated (optional)
	-r, --recursive              search subdirectories too
	--imgurid [imgur client id]  for image uploading
```

If you want to upload your images, provide your imgur client ID! I left mine in the batch file because it's helpful and it's not secret anyways.

### Examples
```
givemeanimage .
```
This would select a random image from the current directory only. Include your imgur client ID if you want to upload it!
```
givemeanimage -r .
```
This would select a random image from the current directory and all its subdirectories.
```
givemeanimage C:\Users\You\Pictures -r -f jpg,jpeg
```
This would select all files with the extension jpg or jpeg in your pictures folder (assuming your name is "you").

## License
Public domain. Go nuts.