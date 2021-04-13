

# Two Sum 

Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.

You may assume that each input would have __exactly one solution__, and you may not use the *same* element twice. 

You can return the answer in any order. 

**Example 1:**

```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Output: Because nums[0] + nums[1] == 9, return [0, 1]
```

**Example 2:**

```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Example 3:**

```
Input: nums = [3,3], target = 6
Output: [0,1]
```

**Constraints:**

* `2 <= nums.length <= 10^3`
* `-10^9 <= nums[1] <= 10^9`
* `-10^9 <= target <= 10^9`
* Only one valid answer exists

## Pattern

If the array were sorted, we could solve it using [two pointers](). But we don't get that guarantee, as per example 2. 

There's a brute force solution with nested for loops, which checks every item against every other item, but it runs in O(n^2) time, and we can do better. 

Since this problem uses a linear data structure (an array), is unsorted, and asks for us to hit a certain value, we can use a [Map]() to solve it. 

**Steps:** 

The [Map]() pattern uses a hash map to keep track of array values we have visited as we iterate through the array. 

1. First, we set up an empty hashmap. 
2. Then we iterate through the array. 
3. For each iteration, we subtract the array value from the target value. 
4. Then we check if that difference exists as a key in the hashmap. 
5. If it does, we return the value of that key, along with our current array index. 
6. If it doesn't, we store our current array index in the hashmap, using its array value as the key, which is what makes step 5 work. 

## Code 

```rb
# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer[]}
def two_sum(nums, target) 
    numberHash = {}
    
    nums.each_with_index do |number, index|
        difference = target - number

        if numberHash.key?(difference)
            return [index, numberHash[difference]]
        else 
            numberHash[number] = index
        end
    end
end
```