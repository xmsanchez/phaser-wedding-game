import sys
import os
from PIL import Image

def merge_images(image_files, output_path, direction='horizontal', size=(32,32)):
    images = [Image.open(x).convert('RGBA') for x in image_files]
    images_resized = []

    for image in images:
        # Resize image if it is larger than the canvas
        if image.size[0] > size[0] or image.size[1] > size[1]:
            image.thumbnail(size, Image.ANTIALIAS)

        # Skip if the image is smaller than 15x15
        if image.size[0] < 15 or image.size[1] < 15:
            continue

        new_image = Image.new("RGBA", size)
        new_image.paste(image, ((size[0]-image.size[0])//2,
                                (size[1]-image.size[1])//2))
        images_resized.append(new_image)

    if direction=='horizontal':
        new_img = Image.new('RGBA', (sum(i.width for i in images_resized), max(i.height for i in images_resized)))
        x_offset = 0
        for i in images_resized:
            new_img.paste(i, (x_offset,0))
            x_offset += i.width

    elif direction=='vertical':
        new_img = Image.new('RGBA', (max(i.width for i in images_resized), sum(i.height for i in images_resized)))
        y_offset = 0
        for i in images_resized:
            new_img.paste(i, (0,y_offset))
            y_offset += i.height

    new_img.save(output_path, "PNG")

def main(source_folder):
    output_folder = "merged"
    os.makedirs(output_folder, exist_ok=True)

    image_files = []
    for subdir, dirs, files in os.walk(source_folder):
        for file in files:
            if file.endswith('.png'):
                path = os.path.join(subdir, file)
                image_files.append(path)

    image_files.sort() # this sorts the images by name, modify if you need a different sorting
    new_folder = os.path.join(output_folder)
    os.makedirs(new_folder, exist_ok=True)
    new_file_path = os.path.join(new_folder, f"{os.path.basename(os.path.normpath(source_folder))}.png")
    merge_images(image_files, new_file_path, 'horizontal')

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Please provide the source folder path as a command line argument.")
    else:
        main(sys.argv[1])

