# Quicksort takes an array, a left pointer, and a right index
def quicksort(array, left, right) 
    # If the left pointer is greater than the right index, we're done - so return 
    if left >= right
        return
    end
    # We choose a pivot. For simplicity, let's choose something close to the middle
    pivot = array[(left + right) / 2]
    # Then we choose an index that serves as our partition bound 
    # This is based on the array, the current left and right indices, and the pivot value
    index = partition(array, left, right, pivot)
    # Finally, we recursively sort the partitions, based on that index 
    quicksort(array, left, index -1)
    quicksort(array, index, right)
end

# Partition is the magic, it takes the array, the left index, the right index, and the pivot and swaps values
def partition(array, left, right, pivot)
    # Start increasing the left index and decreasing the right index
    while left <= right do 
        # Find the first left index with a value larger than our pivot value
        while array[left] < pivot 
            left += 1
        end
        # Find the first right index with a value smaller than our pivot value
        while array[right] > pivot do
            right -= 1
        end
        # Check the left index is still smaller than the right index and swap the elements
        # Keep moving down the loop
        if left <= right
            array[left], array[right] = array[right], array[left] 
            left += 1 
            right -= 1
        end
    end
    # The left value is where our partition should begin. 
    return left
end

# Set up the test array
arr = [0, -1, 10, 35, 23, 50, 7]
# Sort it, starting at the first index, and with a right index of the last element
quicksort(arr, 0, arr.length - 1)
# Quicksort works in place, so let's log out the array
puts arr