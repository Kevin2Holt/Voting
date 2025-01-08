Being minorly upset with modern governments (among other things), I decided to try modeling some voting systems, potentially making some personal modifications. All with the goal of finding the "best" voting system.

\**All of these methods assume that only 1 winner is desired and all other candidates are irrelivent.*

My general train of thought revolved around a **cascading** system where voters are divided into groups, groups are divided into groups, and those are divided again, etc. for as many layers as is desired. Generally, for my testing, I stuck to 3 layers.
Each group (lowest layer) is tallied and a score / winner is declared for that group. The next layer of groups is then calculated using each group as the individual voters. This process is repeated for each layer until you reach the outter-most layer, which declares the overall winner.


My first several attempts consisted of a ranked system where each voter ranks the candidates relative to each other (no difference is made for level of preference comparatively). This actually worked great as intended. It only started failing once I tried to add in party preference, where each voter has a preference and different groupings had a general bias. That is when I started running into assorted programming issues. So I scrapped that version and started fresh.


My final attempt used the acception model. This is where each voter simply rates each candidate on a scale (say, 0-10). The biggest benefit to this method is that regardless of one candidate's score, it doesn't affect the other's scores. You could put a 10 on every candidate, though that would be as productive as not voting at all. This program, following the cascade model, decided a winner based on the average score each candidate recieved.
*Despite only looking for a single winner, this method does result in a 2nd place, 3rd place, etc.*


Since I was looking for the best voting system, I wanted to know how *"satisfied"* the people were. Basically, I calculated the percenage of individual voters that originally ranked the winner in their top spot (Version 1). Then, similarly calculated the percentage that voted for them in their top 2. So on and so forth. I'm not sure if there were flaws in my code, but I had a fairly high percentage, averaging a little above the even split (i.e. just above 1/3 if there were 3 candidates, as in about 35–40%).

I wasn't entirely sure what the best way to calculate the satisfaction rate with the acception model (Version 2). I considered using the number of people that ranked the winner 10 (or 9–10 for the second percentage, etc.). I think I took the easy path and just looked at the average scores for each candidate. *(I don't remember how this model performed, but it was my last version, so I must have been somewhat satisfied)*
