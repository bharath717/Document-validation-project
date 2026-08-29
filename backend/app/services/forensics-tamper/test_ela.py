from ela import perform_ela
import os


input_file = "test_images/sample.jpg"
output_file = "test_images/ela_result.jpg"


try:

    ela_image = perform_ela(input_file)

    ela_image.save(output_file)

    print("ELA successful!")
    print("Output:", output_file)

except Exception as e:

    print("ELA failed!")
    print("Error:", e)