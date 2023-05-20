import cv2
import numpy as np

# Load the image
img = cv2.imread('Lanto_Charas (10).png')

# Convert the image to grayscale and binary
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 225, 255, cv2.THRESH_BINARY_INV)

# Find contours in the binary image
contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

min_width = 32  # replace with your value
min_height = 32  # replace with your value

max_width = 0  # to keep track of the max width of the bounding boxes
max_height = 0  # to keep track of the max height of the bounding boxes

# Calculate max width and height of the bounding boxes
for i, contour in enumerate(contours):
    _, _, width, height = cv2.boundingRect(contour)

    print('width is: ' + str(width))
    print('height is: ' + str(height))

    if width > max_width:
        max_width = width
    if height > max_height:
        max_height = height

# Ensure min_width and min_height are respected
max_width = max(min_width, max_width)
max_height = max(min_height, max_height)

print('max_width: ' + str(max_width))
print('max_height: ' + str(max_height))

# Create a blank image with size enough to accommodate all elements
rows = 5  # replace with your number of rows
cols = 5  # replace with your number of columns
output_img = np.zeros((rows*max_height, cols*max_width, 3), dtype=np.uint8)

# Iterate over contours again to place each element in the output image
for i, contour in enumerate(contours):
    x, y, width, height = cv2.boundingRect(contour)
    print(f'{i} image with {x} and {y} coords, {width} width and {height} height')
    # Crop the original image using the calculated bounding box
    cropped_img = img[y:y+height, x:x+width]

    # Resize cropped_img to max_width and max_height if it's smaller
    if width < max_width or height < max_height:
        cropped_img = cv2.resize(cropped_img, (max_width, max_height))

    # Calculate position in the output image (assuming i is from 0 to rows*cols-1)
    row = i // cols
    col = i % cols

    # Place the cropped image at the correct position in the output image
    output_img[row*max_height:(row+1)*max_height, col*max_width:(col+1)*max_width] = cropped_img

# Save the output image
cv2.imwrite('output.png', output_img)

