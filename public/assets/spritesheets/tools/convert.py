import cv2
import numpy as np
import os
import sys

def process_spritesheet(file_path):
    # Load image
    image = cv2.imread(file_path, cv2.IMREAD_UNCHANGED)
    
    # Make sure it's RGBA
    if image.shape[2] != 4:
        raise Exception("The image must have 4 channels (RGBA)")

    # Convert the image to grayscale for contour detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGRA2GRAY)
    
    # Apply a binary threshold to the image. All pixels with any color will be converted to 255 (white).
    _, threshold = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

    # Find contours in the threshold image.
    contours, _ = cv2.findContours(threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # create output directory
    output_dir = f'output/{os.path.splitext(os.path.basename(file_path))[0]}'
    os.makedirs(output_dir, exist_ok=True)

    for i, contour in enumerate(contours):
        # Get the rectangle that contains the contour
        x, y, w, h = cv2.boundingRect(contour)

        # Make sure the bounding box has reasonable size
        if w > 5 and h > 5:
            # Crop the image using the coordinates of the bounding rectangle
            sprite = np.copy(image[y:y+h, x:x+w])

            # Write the sprite to a file
            cv2.imwrite(f'{output_dir}/sprite_{i}.png', sprite)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <spritesheet_path>")
        sys.exit(1)
    
    process_spritesheet(sys.argv[1])

