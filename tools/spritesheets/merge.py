import sys
import os
from PIL import Image

def merge_images(image_files, output_path, size, sprites_per_row=12):
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

    total_width = sprites_per_row * size[0]
    total_height = ((len(images_resized) - 1) // sprites_per_row + 1) * size[1]
    new_img = Image.new('RGBA', (total_width, total_height))

    for i, img in enumerate(images_resized):
        x_offset = (i % sprites_per_row) * size[0]
        y_offset = (i // sprites_per_row) * size[1]
        new_img.paste(img, (x_offset, y_offset))

    new_img.save(output_path, "PNG")


def main(source_folder, size):
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
    merge_images(image_files, new_file_path, size)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Please provide the source folder path and sprite size as command line arguments.")
        print("Example: python main.py <source_folder> 32 32")
    else:
        source_folder = sys.argv[1]
        sprite_width = int(sys.argv[2])
        sprite_height = int(sys.argv[3])
        size = (sprite_width, sprite_height)
        main(source_folder, size)

