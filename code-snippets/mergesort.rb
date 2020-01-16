def merge_sort(array)
    # Base case - return the array if it's a length of 1
    return array if array.size <= 1
    # Grab the mid point of the array
    mid = array.size / 2
    # Sort sub-arrays: from the start to the middle, and the middle to the end
    # Then merge them together
    merge(merge_sort(array[0...mid]), merge_sort(array[mid...array.size]))
  end
  
  def merge(left, right)
    # Set up an empty return array
    result = []
  
    # Until either the left or right array has no more elements, shift the larger value into the results
    until left.empty? || right.empty?
      result << (left[0] <= right[0] ? left : right).shift
    end
  
    # Append the any leftover values to the array
    result.concat(left).concat(right)
  end

arr = [28, 27, 43, 3, 9, 82, 10]

puts merge_sort(arr)