---
title: Duplicate Zeros - Naive
date: 2021-04-18
description: The naive solution to an array-based easy level LeetCode problem, duplicating zeros in an array.
leetcode_link: https://leetcode.com/problems/duplicate-zeros
---

## Problem 

Given a fixed length array arr of integers, duplicate each occurrence of zero, shifting the remaining elements to the right.

Note that elements beyond the length of the original array are not written.

Do the above modifications to the input array in place, do not return anything from your function.

## Solution

This is the brute force solution, expressed in Ruby. 

I figured this out by doing a few examples by hand and thinking to myself what was going on in my brain. Since I wrote the original input, and then wrote to a "new" array, I realized I needed to duplicate the input array and use it as a reference. 

Once you duplicate the array for reference, you'll want two iterators: 

1. `i` iterates through the input array, modifying its values 
2. `j` iterates through the reference array, providing values for reference. 

For ease of use, I also set the variable `n` to equal `arr.length`. We'll use that in the while loop. 

Start both at `0`. Make `arr[i]` = `reference[j]` to start. Each step of the way, check if `reference[j]` is `0`. If it is, you want to *do that again*, because the solution tells you to duplicate zeros. In order to do it again, we increment `i` by 1, and we *leave `j` alone*. I originally had trouble wrapping my head around which iterator to increment and how to "duplicate" the `0`. 

Next, you'll want to increment both `i` and `j` by 1. You need to do this regardless of whether or not the number was `0`, because we need to keep moving through both arrays. 

The one gotcha to look out for is that in the `0` check, we increment `i`, but it's possible that the last element is `0`, in which case you'll end up with a larger array (in languages like Ruby, which have dynamically-resizing arrays. In other languages, you may have actual runtime errors). So we can check that `i` < `n`

The while loop should terminate when `i == n`. 

## Code

```rb
# @param {Integer[]} arr
# @return {Void} Do not return anything, modify arr in-place instead.
def duplicate_zeros(arr)
	# Create a reference array 
    reference = arr.dup
    
	# Set up iterator i, to move through the input array
    i = 0 
	# Set up iterator j, to move through the reference array
    j = 0
	# Set up n as a convenience to represent the length of the input array
    n = arr.length
    
	# Loop and increment `i` until we've gone through the entire input array.
    while i < n do 
	    # First up, overwrite the array at position i with our reference value at position j
        arr[i] = reference[j] 
		# Then, check if that value was 0.
        if reference[j] == 0 
		    # If so, increment i by one. This is how we "duplicate" the zero.
            i+= 1 
			# You'll need to write that 0 to arr[i]. But be careful - if reference[j] == 0, and j == n -1 (i.e. the last reference value is 0)
            # then you'll overflow. So use `unless` to make sure `i < n`.
            arr[i] = reference[j] unless i >= n
        end
		# We will always need to increment i and j at each step, to continue moving the loop forward.
        i += 1
        j += 1
    end
end
```

## Analysis

This solution take O(n) time and O(n^2) space, since you have to loop through the input array just once, but you'll need to duplicate it. There's a better way that uses constant space, but I wanted to explore the naive solution in depth, because it honestly threw me for a loop for a bit!
