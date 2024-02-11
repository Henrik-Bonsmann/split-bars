# split-bars
This foundry module lets you segment your resource bars with custom rules and keep track at a glance.

![bar-split](https://github.com/Henrik-Bonsmann/split-bars/assets/112704394/1e677d34-2ca3-412f-b293-51bed84c1b08)

Keep track of important thresholds like encumbrance, hp morale values or pain and wound levels or visualize the amount of limited secondary resources directly!

## Usage:
Specify your segmentation rules in the Token Configuration. Simply separate different rules with `space`.

![image](https://github.com/Henrik-Bonsmann/split-bars/assets/112704394/6193d672-7295-480c-8fe0-fbe3909e6fe4)

### Fractions:
Values smaller than 1 will be interpreted as a fraction of the resource. They can be provided in three different ways:
1. As decimal:
   > .2 .6 .1
3. As percentage:
   > 75% 33% 20%
5. As interger fraction:
   > 1/3 7/8

### Fixed Values:
As long as it's below the bar's maximum, you can also provide specific values for the segmentation:
> 100 1 3

### Repetition:
A rule can be repeated for the entire length of the bar by adding the `:` symbol - inspired by the [repeat sign](https://en.wikipedia.org/wiki/Repetition_(music)) in music.

> 1/3:

Will split the bar in thirds, with segmentations at 1/3 and 2/3.

> 1:

Results in a 'box' for every point of resource.
